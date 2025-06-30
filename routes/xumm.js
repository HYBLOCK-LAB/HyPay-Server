const express = require('express');
const router = express.Router();
const { XamanWallet } = require('hypay-adapter');

router.get('/xumm-sign', async (req, res) => {
  try {
    const { destination, amount, identifier, instruction, blob } = req.query;
    console.log('Received /xumm-sign with:', { destination, amount, identifier, instruction, blob });
    if (!destination || !amount) {
      return res.status(400).json({ error: 'Missing destination or amount' });
    }
    const wallet = new XamanWallet(destination, {
      key: process.env.XUMM_API_KEY,
      secret: process.env.XUMM_API_SECRET
    });
    const { address } = await wallet.connect();
    const { pong } = await wallet.ping();
    console.log(pong)
    const payloadUuid = await wallet.createPaymentTx({
      amount,
      meta_data: {
        identifier,
        instruction,
        blob
      }
    });
    const payload = await wallet.xumm.payload?.get(payloadUuid);
    if (payload) {
      return res.redirect(`https://xumm.app/sign/${payloadUuid}`);
    } else {
      return res.status(500).json({ error: 'Failed to create XUMM payload',details: payload.next  });
    }
  } catch (error) {
    console.error('Error creating XUMM sign request:', error);
    res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
  }
});
module.exports = router;