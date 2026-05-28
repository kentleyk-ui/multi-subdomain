export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { subdomain } = req.body;

  if (!subdomain) {
    return res.status(400).json({ error: "subdomain manquant" });
  }

  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(subdomain)) {
    return res.status(400).json({ error: "Format de sous-domaine invalide" });
  }

  try {
    const zoneId = process.env.CF_ZONE;
    const apiKey = process.env.CF_KEY;
    const email = process.env.CF_EMAIL;

    if (!zoneId || !apiKey || !email) {
      return res.status(500).json({
        error: "Configuration manquante: CF_ZONE, CF_KEY, CF_EMAIL requis",
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: subdomain,
          content: "cname.vercel-dns.com",
          ttl: 3600,
          proxied: false,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ error: "Cloudflare error", details: data });
    }

    return res.status(200).json({
      message: "Sous-domaine créé",
      url: `https://${subdomain}.milele4ever.com`,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
