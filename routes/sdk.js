const express = require('express');
const router = express.Router();

router.post('/log', (req, res) => {
  console.log(`[LOG ${req.apiKey.owner}]`, req.body);
  res.json({ status: 'Logged' });
});

router.get('/xumm-api-key', (req, res) => {
  res.json({
    apiKey: process.env.XUMM_API_KEY,
  });
});

module.exports = router;