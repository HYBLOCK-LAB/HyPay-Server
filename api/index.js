const express = require('express');
const mongoose = require('mongoose');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const { rateLimiter } = require('../middleware/rateLimit');
const sdkRoutes = require('../routes/sdk');
const xummRoutes = require('../routes/xumm');
const supportRoutes = require('../routes/support');
const connectToDatabase = require('../utils/db');
require('dotenv').config();

const app = express();

app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(async (req, res, next) => {
    await connectToDatabase();
    next();
});

app.use((req, res, next) => {
    console.log('Incoming path:', req.path);
    next();
});

app.use('/sdk', apiKeyAuth, rateLimiter, sdkRoutes);
app.use(xummRoutes);
app.use(supportRoutes);

// if you want to receive webhook callbacks from XUMM (e.g., transaction status updates).
// app.post('/xumm-hooks', (req, res) => {
//     console.log('Received XUMM webhook:', req.body);
//     res.status(200).send('OK');
// });

module.exports = app;