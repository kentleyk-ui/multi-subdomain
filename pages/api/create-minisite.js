const SUB_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { subdomain } = req.body;

  if (!subdomain) {
    return res.status(400).json({ error: "subdomain manquant" });
  }

  if (!SUB_REGEX.test(subdomain)) {
    return res.status(400).json({ error: "Format de sous-domaine invalide" });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${subdomain} — Royaume de Kent</title>
  <style>
    body { background: #000; color: #fff; font-family: Arial; text-align: center; padding: 80px; }
    h1 { color: #f5d67b; }
  </style>
</head>
<body>
  <h1>Bienvenue dans le royaume ${subdomain}</h1>
  <p>Construit par Kent — Monark suprême.</p>
</body>
</html>`;

  return res.status(200).json({ message: "Mini-site généré", html });
}
