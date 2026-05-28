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

  let output = `🚀 Domaine sélectionné : ${domain}\n\n`;

  for (const sub of subs) {
    if (!sub) continue;
    if (!SUB_REGEX.test(sub)) {
      output += `   ⚠️ Ignoré : "${sub}" — format invalide\n\n`;
      continue;
    }

    const full = `${sub}.${domain}`;
    output += `➡️ Création : ${full}\n`;

    try {
      // 1. DNS CLOUDFLARE
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE}/dns_records`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.CF_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "CNAME",
            name: sub,
            content: "cname.vercel-dns.com",
            ttl: 1,
            proxied: false,
          }),
        }
      );

      if (!cfRes.ok) {
        const cfErr = await cfRes.json();
        const alreadyExists = cfErr.errors?.some((e) => e.code === 81053);
        if (alreadyExists) {
          output += `   ℹ️ DNS déjà existant — poursuite vers Vercel\n`;
        } else {
          throw new Error(`Cloudflare DNS: ${JSON.stringify(cfErr.errors)}`);
        }
      }

      // 2. PAGE HTML unique par sous-domaine
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${sub.toUpperCase()}</title>
  <style>
    body {
      background: black;
      color: gold;
      font-size: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>${sub.toUpperCase()}</body>
</html>`;

      // 3. DEPLOY VERCEL via REST API
      const deployRes = await fetch(
        `https://api.vercel.com/v13/deployments?teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: sub,
            files: [{ file: "index.html", data: html }],
            projectSettings: { framework: null },
            target: "production",
          }),
        }
      );

      if (!deployRes.ok) {
        const deployErr = await deployRes.json();
        throw new Error(`Vercel deploy: ${JSON.stringify(deployErr.error)}`);
      }

      const deploy = await deployRes.json();

      // 4. ATTENDRE QUE LE DÉPLOIEMENT SOIT READY
      let ready = false;
      for (let i = 0; i < 20; i++) {
        const poll = await fetch(
          `https://api.vercel.com/v13/deployments/${deploy.id}?teamId=${process.env.VERCEL_TEAM_ID}`,
          { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
        );
        const { readyState } = await poll.json();
        if (readyState === "READY") { ready = true; break; }
        if (readyState === "ERROR" || readyState === "CANCELED") break;
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (!ready) throw new Error("Déploiement non prêt après 60s");

      // 5. AJOUTER LE DOMAINE AU PROJET (déclenche SSL auto-provisioning)
      const addDomainRes = await fetch(
        `https://api.vercel.com/v10/projects/${sub}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: full }),
        }
      );

      if (!addDomainRes.ok) {
        const domainErr = await addDomainRes.json();
        const alreadyExists = domainErr.error?.code === "DOMAIN_ALREADY_EXISTS";
        if (!alreadyExists) {
          throw new Error(`Vercel domaine: ${JSON.stringify(domainErr.error)}`);
        }
      }

      // 6. ATTENDRE que le domaine soit vérifié + SSL provisioned (max 30s)
      let verified = false;
      for (let i = 0; i < 15; i++) {
        const checkRes = await fetch(
          `https://api.vercel.com/v10/projects/${sub}/domains/${full}?teamId=${process.env.VERCEL_TEAM_ID}`,
          { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } }
        );
        if (checkRes.ok) {
          const domainData = await checkRes.json();
          if (domainData.verified) {
            verified = true;
            output += `   ℹ️ Domaine vérifié + SSL prêt\n`;
            break;
          }
        }
        if (i < 14) await new Promise((r) => setTimeout(r, 2000));
      }
      if (!verified) output += `   ⚠️ Domaine en cours de validation SSL, alias créé quand même\n`;

      // 7. ASSIGNER LE DOMAINE au déploiement (avec retry si cert_missing)
      let aliasCreated = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        const aliasRes = await fetch(
          `https://api.vercel.com/v2/deployments/${deploy.id}/aliases`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alias: full,
              teamId: process.env.VERCEL_TEAM_ID,
            }),
          }
        );

        if (aliasRes.ok) {
          aliasCreated = true;
          break;
        }

        const aliasErr = await aliasRes.json();
        if (aliasErr.error?.code === "cert_missing") {
          if (attempt < 4) {
            output += `   ⏳ SSL cert en préparation (${attempt + 1}/4), nouvelle tentative...\n`;
            await new Promise((r) => setTimeout(r, 3000));
            continue;
          } else {
            throw new Error(`Vercel alias après 5 tentatives: ${JSON.stringify(aliasErr.error)}`);
          }
        } else if (aliasErr.error?.code === "not_modified") {
          aliasCreated = true;
          output += `   ℹ️ Alias déjà existant (conflit antérieur resolu)\n`;
          break;
        } else {
          throw new Error(`Vercel alias: ${JSON.stringify(aliasErr.error)}`);
        }
      }

      if (!aliasCreated) {
        throw new Error("Vercel alias: impossible de créer l'alias après 5 tentatives");
      }

      // 8. TRACKER le projet créé dans projects.json
      try {
        let projects = {};
        try { projects = await readData("projects.json"); } catch {}
        projects[full] = {
          name: sub,
          domain: full,
          projectId: sub,
          deploymentId: deploy.id,
          createdAt: new Date().toISOString(),
        };
        await writeData("projects.json", projects);
      } catch {}

      output += `   ✅ OK → https://${full}\n\n`;
    } catch (err) {
      output += `   ❌ Erreur : ${err.message}\n\n`;
    }
  }

  return res.status(200).json({ message: output });
}
