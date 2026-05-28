import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let logs = [];
      try {
        const data = await readData("activity-logs.json");
        logs = Array.isArray(data) ? data : [];
      } catch {}
      const recent = logs.slice(-50).reverse();
      return res.status(200).json({ logs: recent });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    const { action, subdomain, page, details } = req.body;

    try {
      let logs = [];
      try {
        const data = await readData("activity-logs.json");
        logs = Array.isArray(data) ? data : [];
      } catch {}

      logs.push({
        timestamp: new Date().toISOString(),
        action,
        subdomain,
        page,
        details,
      });

      // Garder seulement 1000 derniers logs
      if (logs.length > 1000) logs = logs.slice(-1000);

      await writeData("activity-logs.json", logs);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
