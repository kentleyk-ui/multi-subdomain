import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Obtenir la configuration de sauvegarde actuelle
    try {
      let config = {};
      try { config = await readData("backup-config.json"); } catch {}

      return res.status(200).json({
        location: config.location || "local",
        path: config.path || "/tmp/backups",
        autoBackup: config.autoBackup ?? true,
        maxBackups: config.maxBackups ?? 2,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    // Mettre à jour la configuration de sauvegarde
    try {
      const { location, path, autoBackup, maxBackups } = req.body;

      if (!location || !path) {
        return res.status(400).json({ error: "location et path sont requis" });
      }

      const config = {
        location: location, // "local", "cloud", "external"
        path: path,
        autoBackup: autoBackup !== undefined ? autoBackup : true,
        maxBackups: maxBackups || 2,
        updatedAt: new Date().toISOString(),
      };

      await writeData("backup-config.json", config);

      return res.status(200).json({
        ok: true,
        message: "Configuration de sauvegarde mise à jour",
        config,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
