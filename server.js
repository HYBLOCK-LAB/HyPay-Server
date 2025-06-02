require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { apiKeyAuth } = require('./middleware/apiKeyAuth');
const { rateLimiter } = require('./middleware/rateLimit');
const sdkRoutes = require('./routes/sdk');

const app = express();
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URI}`, { dbName: 'HyPay', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected to HyPay DB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/sdk', apiKeyAuth, rateLimiter, sdkRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
