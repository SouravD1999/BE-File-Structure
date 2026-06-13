global.crypto = require('crypto');

const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Handle JSON parsing globally at the absolute top
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Bind routes
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('Backend server running cleanly on http://localhost:3000');
});