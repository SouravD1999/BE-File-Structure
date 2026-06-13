const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/tcs_interview_db'; 
    await mongoose.connect(mongoURI);
    console.log('🚀 Successfully connected to local MongoDB via Config!');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDB;