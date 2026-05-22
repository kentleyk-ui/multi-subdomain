import fs from "fs";
import { execSync } from "child_process";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { domain, subs } = req.body;

  let output = `🚀 Domaine sélectionné : ${domain}\n\n`;

  for (const sub of subs) {
    if (!sub) continue;

    const full = `${sub}.${domain}`;
    output += `➡️ Création : ${full}\n`;

    try {
      // 1. DNS CLOUDFLARE
      await fetch(
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

      // 2. PAGE AUTO
      const html = `
        <html>
        <head>
          <style>
            body {
              background: black;
              color: gold;
              font-size: 5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: Arial;
            }
          </style>
        </head>
        <body>${sub.toUpperCase()}</body>
        </html>
      `;

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

  return res.json({ message: output });
}
