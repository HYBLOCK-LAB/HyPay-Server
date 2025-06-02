const express = require('express');
const router = express.Router();

router.post('/log', (req, res) => {
  console.log(`[LOG ${req.apiKey.owner}]`, req.body);
  res.json({ status: 'Logged' });
});

module.exports = router;