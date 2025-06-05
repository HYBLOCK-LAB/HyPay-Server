const express = require('express');
const router = express.Router();
const { XamanWallet } = require('hypay-adapter');

router.post('/xumm-sign', async (req, res) => {
    try {
      // You can get these from req.body or set defaults for testing
      const { destination, amount } = req.body;
  
      // Create a XamanWallet instance (destination is required)
      const wallet = new XamanWallet(destination, {
        key: process.env.XUMM_API_KEY,
        secret: process.env.XUMM_API_SECRET
      });
      const { address } = await this.wallet.connect();
      const { pong } = await this.wallet.ping();
      console.log(pong)
  
      // Create a payment payload
      const payloadUuid = await wallet.createPaymentTx({ amount });
  
      // Get the payload details (including next.always URL)
      const payload = await wallet.xumm.payload?.get(payloadUuid);
  
      if (payload && payload.next && payload.next.always) {
        // Redirect the user to the XUMM universal link
        return res.redirect(payload.next.always);
      } else {
        return res.status(500).json({ error: 'Failed to create XUMM payload' });
      }
    } catch (error) {
      console.error('Error creating XUMM sign request:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

// not working

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
  //     if (payload && payload.next && payload.next.always) {
  //       return res.redirect(payload.next.always);
  //     } else {
  //       return res.status(500).json({ error: 'Failed to create XUMM payload' });
  //     }
  //   } catch (error) {
  //     console.error('Error creating XUMM sign request:', error);
  //     res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
  //   }
  // });

  const { XummSdk } = require('xumm-sdk');

    router.get('/xumm-test', async (req, res) => {
    try {
        const sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);
        const payload = {
        TransactionType: 'Payment',
        Destination: req.query.destination,
        Amount: req.query.amount
        };
        const result = await sdk.payload.create({ txjson: payload });
        console.log('XUMM SDK payload create response:', result);
        res.json(result);
    } catch (error) {
        console.error('XUMM SDK error:', error);
        res.status(500).json({ error: error.message });
    }
    });

    router.get('/xumm-sign', async (req, res) => {
        try {
          const { destination, amount } = req.query;
          if (!destination || !amount) {
            return res.status(400).json({ error: 'Missing destination or amount' });
          }
      
          const sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);
            
          const payload = {
            TransactionType: 'Payment',
            Destination: destination,
            Amount: amount
          };
      
          const result = await sdk.payload.create({ txjson: payload });
      
          if (result && result.next && result.next.always) {
            // Redirect the user to the XUMM universal link
            return res.redirect(result.next.always);
          } else {
            return res.status(500).json({ error: 'Failed to create XUMM payload', details: result });
          }
        } catch (error) {
          console.error('XUMM SDK error:', error);
          res.status(500).json({ error: error.message || 'Internal server error', stack: error.stack });
        }
    });
module.exports = router;