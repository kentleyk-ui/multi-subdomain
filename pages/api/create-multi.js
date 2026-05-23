import fs from "fs";
import { execSync } from "child_process";

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

    const full = `${sub}.${domain}`;
    output += `➡️ Création : ${full}\n`;

    try {
      // 1. DNS CLOUDFLARE
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE}/dns_records`,
        {
          method: "POST",
          headers: {
            "X-Auth-Email": process.env.CF_EMAIL,
            "X-Auth-Key": process.env.CF_KEY,
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
        throw new Error(`Cloudflare: ${JSON.stringify(cfErr.errors)}`);
      }

      // 2. PAGE AUTO
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

      if (!fs.existsSync("./auto")) fs.mkdirSync("./auto");
      fs.writeFileSync("./auto/index.html", html);

      // 3. DEPLOY VERCEL
      execSync(
        `vercel deploy auto --prod --token ${process.env.VERCEL_TOKEN} --confirm`,
        { stdio: "ignore" }
      );

      output += `   ✅ OK → https://${full}\n\n`;
    } catch (err) {
      output += `   ❌ Erreur : ${err.message}\n\n`;
    }
  }

  return res.status(200).json({ message: output });
}
