const SUB_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { domain, subs } = req.body;

  if (!domain || !Array.isArray(subs) || subs.length === 0) {
    return res.status(400).json({ error: "domain (string) et subs (array) requis" });
  }

  let output = `🗑️ Suppression — domaine : ${domain}\n\n`;

  for (const sub of subs) {
    if (!sub) continue;
    if (!SUB_REGEX.test(sub)) {
      output += `   ⚠️ Ignoré : "${sub}" — format invalide\n\n`;
      continue;
    }

    const full = `${sub}.${domain}`;
    output += `➡️ Suppression : ${full}\n`;

    try {
      // 1. TROUVER L'ID DU RECORD DNS CLOUDFLARE
      const listRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE}/dns_records?type=CNAME&name=${full}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CF_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const listData = await listRes.json();

      if (!listData.success || listData.result.length === 0) {
        output += `   ⚠️ DNS introuvable pour ${full}\n`;
      } else {
        const recordId = listData.result[0].id;
        const delRes = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE}/dns_records/${recordId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.CF_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const delData = await delRes.json();
        if (!delData.success) {
          throw new Error(`Cloudflare DELETE: ${JSON.stringify(delData.errors)}`);
        }
        output += `   ✅ DNS supprimé\n`;
      }

      // 2. SUPPRIMER LE DOMAINE DU PROJET VERCEL
      const rmDomainRes = await fetch(
        `https://api.vercel.com/v10/projects/${sub}/domains/${full}?teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
        }
      );

      if (rmDomainRes.status === 404) {
        output += `   ⚠️ Domaine Vercel introuvable (déjà supprimé ?)\n`;
      } else if (!rmDomainRes.ok) {
        const rmErr = await rmDomainRes.json();
        output += `   ⚠️ Vercel domaine : ${JSON.stringify(rmErr.error?.message || rmErr)}\n`;
      } else {
        output += `   ✅ Domaine Vercel retiré\n`;
      }

      // 3. SUPPRIMER LE PROJET VERCEL
      const delProjRes = await fetch(
        `https://api.vercel.com/v9/projects/${sub}?teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
        }
      );

      if (delProjRes.status === 404) {
        output += `   ⚠️ Projet Vercel introuvable\n`;
      } else if (!delProjRes.ok) {
        const projErr = await delProjRes.json();
        output += `   ⚠️ Vercel projet : ${JSON.stringify(projErr.error?.message || projErr)}\n`;
      } else {
        output += `   ✅ Projet Vercel supprimé\n`;
      }

      output += `   🗑️ ${full} supprimé\n\n`;
    } catch (err) {
      output += `   ❌ Erreur : ${err.message}\n\n`;
    }
  }

  // NETTOYER le tracking des projets supprimés
  try {
    let projects = {};
    try { projects = await readData("projects.json"); } catch {}
    for (const sub of subs) {
      const full = `${sub}.${domain}`;
      delete projects[full];
    }
    await writeData("projects.json", projects);
  } catch {}

  return res.status(200).json({ message: output });
}
