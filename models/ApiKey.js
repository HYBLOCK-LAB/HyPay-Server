const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  enabled: { type: Boolean, default: true },
  rateLimit: { type: Number, default: 1000 },
  lastUsedAt: { type: Date },
  meta: { type: Object }
}, {
  collection: 'apis'
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
