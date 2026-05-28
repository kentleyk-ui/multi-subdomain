import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { subdomain } = req.body;

    let pages = {};
    let backups = [];
    let config = {};

    try { pages = await readData("pages.json"); } catch {}
    try {
      const data = await readData("backups.json");
      backups = Array.isArray(data) ? data : [];
    } catch {}
    try { config = await readData("backup-config.json"); } catch {}

    // Vérifier si un backup a déjà été fait dans les 24 heures
    const lastBackupTime = backups.length > 0
      ? new Date(backups[backups.length - 1].timestamp).getTime()
      : 0;
    const now = Date.now();
    const interval = (config.interval || 24) * 3600000; // en ms

    if (now - lastBackupTime < interval) {
      return res.status(200).json({
        ok: true,
        skipped: true,
        message: `Prochain backup dans ${Math.ceil((interval - (now - lastBackupTime)) / 3600000)}h`,
        nextBackup: new Date(lastBackupTime + interval).toISOString(),
      });
    }

    // Créer le backup
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
      automatic: true,
    };

    backups.push(backup);

    // Garder seulement les N derniers backups
    const maxBackups = config.maxBackups || 2;
    if (backups.length > maxBackups) {
      backups = backups.slice(-maxBackups);
    }

    await writeData("backups.json", backups);

    // Mettre à jour la programmation
    const schedule = {
      enabled: config.autoBackup ?? true,
      interval: config.interval || 24,
      lastBackup: timestamp,
      nextBackup: new Date(now + interval).toISOString(),
    };
    await writeData("backup-schedule.json", schedule);

    return res.status(200).json({
      ok: true,
      message: "Backup automatique créé",
      backup,
      schedule,
      totalBackups: backups.length,
      maxBackups: maxBackups,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
