const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Manager'], // Restricts the values to only these two options
    default: 'Manager' 
  }
});

module.exports = mongoose.model('User', UserSchema);