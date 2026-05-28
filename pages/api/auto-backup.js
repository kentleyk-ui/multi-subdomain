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

    const backup = {
      timestamp: new Date().toISOString(),
      pagesCount: Object.values(pages).reduce((sum, sp) => sum + Object.keys(sp).length, 0),
      subdomainCount: Object.keys(pages).length,
      hash: JSON.stringify(pages).substring(0, 16),
    };

    backups.push(backup);

    // Garder seulement les 30 derniers backups
    if (backups.length > 30) backups = backups.slice(-30);

    await writeData("backups.json", backups);
    return res.status(200).json({ ok: true, backup });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
