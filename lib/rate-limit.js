// Rate limiting in-memory store
const requestCounts = new Map();
const WINDOW_SIZE = 60000; // 1 minuto
const MAX_REQUESTS = 100; // máximo requests por minuto

export function rateLimit(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip);

  // Limpiar timestamps antiguos
  const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_SIZE);
  requestCounts.set(ip, validTimestamps);

  if (validTimestamps.length >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((validTimestamps[0] + WINDOW_SIZE - now) / 1000));
    return {
      limited: true,
      remaining: 0,
      resetIn: Math.ceil((validTimestamps[0] + WINDOW_SIZE - now) / 1000),
    };
  }

  validTimestamps.push(now);

  return {
    limited: false,
    remaining: MAX_REQUESTS - validTimestamps.length,
    resetIn: 60,
  };
}

// Middleware para rate limiting
export function withRateLimit(handler) {
  return (req, res) => {
    const limitStatus = rateLimit(req, res);

    if (limitStatus.limited) {
      return res.status(429).json({
        error: "Trop de requêtes. Réessayez dans " + limitStatus.resetIn + " secondes",
        retryAfter: limitStatus.resetIn,
      });
    }

    res.setHeader('X-RateLimit-Remaining', limitStatus.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + 60);

    return handler(req, res);
  };
}

// Limpiar requests antiguos periódicamente
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestCounts.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_SIZE);
    if (validTimestamps.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, validTimestamps);
    }
  }
}, 30000);

export default rateLimit;
