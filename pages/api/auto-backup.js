import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let pages = {};
    let backups = [];

    try { pages = await readData("pages.json"); } catch {}
    try {
      const data = await readData("backups.json");
      backups = Array.isArray(data) ? data : [];
    } catch {}

    const pagesCount = Object.values(pages).reduce((sum, sp) => sum + Object.keys(sp).length, 0);
    const subdomainCount = Object.keys(pages).length;
    const timestamp = new Date().toISOString();

    const backup = {
      id: `backup-${Date.now()}`,
      name: `Sauvegarde ${backups.length + 1}`,
      timestamp: timestamp,
      date: new Date(timestamp).toLocaleDateString("fr-FR"),
      version: backups.length + 1,
      pagesCount: pagesCount,
      subdomainCount: subdomainCount,
      hash: JSON.stringify(pages).substring(0, 16),
      size: JSON.stringify(pages).length,
    };

    backups.push(backup);

    // Garder seulement les 2 derniers backups pour économiser l'espace
    if (backups.length > 2) {
      backups = backups.slice(-2);
    }

    await writeData("backups.json", backups);
    return res.status(200).json({ ok: true, backup, totalBackups: backups.length, maxBackups: 2 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

