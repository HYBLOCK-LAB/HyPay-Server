const express = require('express');
const router = express.Router();

router.get('/support', (req, res) => {
    try {
        res.json({
            email: 'leejaeman0227@gmail.com',
            website: 'https://hy-pay-server.vercel.app',
            team: 'HYBLOCK',
            address: 'Hanyang University, Seoul, South Korea',
            with: 'XRPL Korea, Uniport'
        });
    } catch (error) {
        console.error('Error fetching support information:', error);
        res.status(500).json({ error: 'Failed to fetch support information' });
    }
});

module.exports = router;