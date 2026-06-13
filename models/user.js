const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

// We use module.exports so other files can use this model
module.exports = mongoose.model('User', UserSchema);