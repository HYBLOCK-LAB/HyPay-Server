const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    // Use existing database connection
    return;
  }
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: 'HyPay',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('✅ MongoDB Connected to HyPay DB');
}

module.exports = connectToDatabase;