const ApiKey = require('../models/ApiKey');

async function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key']?.trim();
  console.log('🔑 Received API Key:', key);

  const apiKey = await ApiKey.findOne({ key, enabled: true });
  if (!apiKey) {
    console.log('❌ API Key not found or disabled');
    return res.status(403).json({ error: 'Invalid or disabled API Key' });
  }

  if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
    console.log('⏰ API Key expired');
    return res.status(403).json({ error: 'API Key expired' });
  }

  req.apiKey = apiKey;
  await ApiKey.updateOne({ _id: apiKey._id }, { lastUsedAt: new Date() });
  next();
}

module.exports = { apiKeyAuth };