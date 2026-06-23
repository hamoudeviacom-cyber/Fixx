const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
});

const Members = mongoose.model('members', userSchema);

module.exports = Members;