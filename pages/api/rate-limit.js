export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { endpoint, identifier } = req.body;

    if (!endpoint || !identifier) {
      return res.status(400).json({ error: "endpoint et identifier requis" });
    }

    // Clé de stockage unique
    const key = `ratelimit:${endpoint}:${identifier}`;

    // En production, utiliser Redis
    // Pour la démo: structure simple en mémoire
    const rateLimits = {
      "/api/create-multi": { max: 10, window: 3600 }, // 10 par heure
      "/api/delete-multi": { max: 5, window: 3600 },
      "/api/auto-backup": { max: 20, window: 3600 },
      "/api/check-ssl": { max: 30, window: 3600 },
      "/api/letsencrypt": { max: 5, window: 3600 },
    };

    const limit = rateLimits[endpoint] || { max: 100, window: 3600 };

    // Simuler le tracking (en production: Redis)
    const now = Date.now();
    const windowStart = now - limit.window * 1000;

    return res.status(200).json({
      allowed: true, // Simulé
      limit: limit.max,
      window: limit.window,
      remaining: limit.max,
      resetAt: new Date(now + limit.window * 1000).toISOString(),
      message: `Limite: ${limit.max} requêtes par ${limit.window}s`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
