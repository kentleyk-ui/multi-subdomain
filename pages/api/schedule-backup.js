import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { enabled, interval } = req.body;

      const schedule = {
        enabled: enabled || false,
        interval: interval || 24,
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + (interval * 3600000)).toISOString(),
      };

      await writeData("backup-schedule.json", schedule);

      return res.status(200).json({
        ok: true,
        message: "Programmation sauvegardée",
        schedule,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      let schedule = {};
      try { schedule = await readData("backup-schedule.json"); } catch {}

      return res.status(200).json({
        enabled: schedule.enabled ?? false,
        interval: schedule.interval ?? 24,
        lastBackup: schedule.lastBackup,
        nextBackup: schedule.nextBackup,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
