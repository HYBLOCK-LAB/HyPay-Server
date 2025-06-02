const crypto = require('crypto');

function generateApiKey(length = 64) {
  return crypto.randomBytes(length / 2).toString('hex');
}

module.exports = { generateApiKey };