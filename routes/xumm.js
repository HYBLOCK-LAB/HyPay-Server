const express = require('express');
const router = express.Router();
const { XamanWallet } = require('hypay-adapter');

// router.get('/xumm-sign', async (req, res) => {
//   try {
//     const { destination, amount, identifier, instruction, blob } = req.query;
//     console.log('Received /xumm-sign with:', { destination, amount, identifier, instruction, blob });
//     if (!destination || !amount) {
//       return res.status(400).json({ error: 'Missing destination or amount' });
//     }
//     const wallet = new XamanWallet(destination, {
//       key: process.env.XUMM_API_KEY,
//       secret: process.env.XUMM_API_SECRET
//     });
//     const { address } = await wallet.connect();
//     const { pong } = await wallet.ping();
//     console.log(pong)
//     const payloadUuid = await wallet.createPaymentTx({
//       amount,
//       meta_data: {
//         identifier,
//         instruction,
//         blob
//       }
//     });
//     const payload = await wallet.xumm.payload?.get(payloadUuid);
//     if (payload) {
//       return res.redirect(`https://xumm.app/sign/${payloadUuid}`);
//     } else {
//       return res.status(500).json({ error: 'Failed to create XUMM payload',details: payload.next  });
//     }
//   } catch (error) {
//     console.error('Error creating XUMM sign request:', error);
//     res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
//   }
// });

// New endpoint that returns JSON with payloadUuid for client tracking
router.post('/xumm-create', async (req, res) => {
  try {
    const { destination, amount, identifier, instruction, blob } = req.body;
    console.log('Received /xumm-create with:', { destination, amount, identifier, instruction, blob });
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
      return res.json({ 
        payloadUuid, 
        signUrl: `https://xumm.app/sign/${payloadUuid}`,
        webUrl: payload.next?.always 
      });
    } else {
      return res.status(500).json({ error: 'Failed to create XUMM payload', details: payload });
    }
  } catch (error) {
    console.error('Error creating XUMM payment:', error);
    res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
  }
});

// Check payment status by payloadUuid
router.get('/xumm-status', async (req, res) => {
  try {
    const { payloadUuid } = req.query;
    if (!payloadUuid) {
      return res.status(400).json({ error: 'Missing payloadUuid' });
    }
    // You may want to cache or reuse the wallet instance, but for now create a new one
    const wallet = new XamanWallet('', {
      key: process.env.XUMM_API_KEY,
      secret: process.env.XUMM_API_SECRET
    });
    const payload = await wallet.xumm.payload?.get(payloadUuid);
    if (!payload) {
      return res.status(404).json({ error: 'Payload not found' });
    }
    // XUMM payload status: see https://xumm.readme.io/reference/payload-get
    // status: 'signed', 'expired', 'cancelled', etc.
    let status = 'pending';
    if (payload.meta?.signed === true) {
      status = 'success';
    } else if (payload.meta?.cancelled === true || payload.meta?.expired === true) {
      status = 'failed';
    }
    return res.json({ status, payload });
  } catch (error) {
    console.error('Error checking XUMM status:', error);
    res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
  }
});

module.exports = router;