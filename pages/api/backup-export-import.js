import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Exporter le backup complet
    try {
      let pages = {};
      let subdomains = {};

      try { pages = await readData("pages.json"); } catch {}
      try { subdomains = await readData("subdomains.json"); } catch {}

      const backup = {
        timestamp: new Date().toISOString(),
        type: "complete-backup",
        version: "1.0",
        data: {
          pages,
          subdomains,
        },
        metadata: {
          pagesCount: Object.values(pages).reduce((sum, sp) => sum + Object.keys(sp).length, 0),
          subdomainCount: Object.keys(subdomains).length,
        },
      };

      return res.status(200).json(backup);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    // Importer/restaurer depuis un backup
    try {
      const { data } = req.body;

      if (!data || !data.pages || !data.subdomains) {
        return res.status(400).json({ error: "Format de backup invalide" });
      }

      await writeData("pages.json", data.pages);
      await writeData("subdomains.json", data.subdomains);

      return res.status(200).json({
        ok: true,
        message: "Backup restauré avec succès",
        restored: {
          pagesCount: Object.values(data.pages).reduce((sum, sp) => sum + Object.keys(sp).length, 0),
          subdomainCount: Object.keys(data.subdomains).length,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
