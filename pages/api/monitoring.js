import { readData, writeData } from "../../lib/data.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { level, message, module, metadata } = req.body;

    if (!level || !message) {
      return res.status(400).json({ error: "level et message requis" });
    }

    // Niveaux: debug, info, warn, error, critical
    const validLevels = ["debug", "info", "warn", "error", "critical"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: `Level invalide: ${validLevels.join(", ")}` });
    }

    try {
      let logs = [];
      try {
        const data = await readData("monitor-logs.json");
        logs = Array.isArray(data) ? data : [];
      } catch {}

      const log = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level,
        message,
        module: module || "system",
        metadata: metadata || {},
        userId: metadata?.userId || null,
        ipAddress: "0.0.0.0", // À capturer depuis req
      };

      logs.push(log);

      // Garder seulement les 10000 derniers logs
      if (logs.length > 10000) {
        logs = logs.slice(-10000);
      }

      await writeData("monitor-logs.json", logs);

      return res.status(200).json({
        ok: true,
        log,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    const { level, module, limit = "100" } = req.query;

    try {
      let logs = [];
      try {
        const data = await readData("monitor-logs.json");
        logs = Array.isArray(data) ? data : [];
      } catch {}

      // Filtrer
      let filtered = logs;
      if (level) filtered = filtered.filter(l => l.level === level);
      if (module) filtered = filtered.filter(l => l.module === module);

      // Prendre les derniers N
      const n = parseInt(limit) || 100;
      const result = filtered.slice(-n).reverse();

      // Statistiques
      const stats = {
        total: logs.length,
        filtered: result.length,
        byLevel: {
          debug: logs.filter(l => l.level === "debug").length,
          info: logs.filter(l => l.level === "info").length,
          warn: logs.filter(l => l.level === "warn").length,
          error: logs.filter(l => l.level === "error").length,
          critical: logs.filter(l => l.level === "critical").length,
        },
      };

      return res.status(200).json({
        logs: result,
        stats,
        pagination: { limit: n, total: filtered.length },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
