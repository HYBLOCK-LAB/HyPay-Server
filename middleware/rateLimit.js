const rateMap = new Map();

function rateLimiter(req, res, next) {
  const key = req.apiKey.key;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = req.apiKey.rateLimit || 1000;

  if (!rateMap.has(key)) rateMap.set(key, { count: 0, lastTime: now });

  const record = rateMap.get(key);

  if (now - record.lastTime > windowMs) {
    record.count = 0;
    record.lastTime = now;
  }

  record.count++;
  if (record.count > maxReq) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  next();
}

module.exports = { rateLimiter };