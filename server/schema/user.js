const mongoose = require('mongoose');

const userDefineSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  loggedIn: {
    type: Date,
  },
  loggedOut: {
    type: Date,
  },
  superadmin: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  manager: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('users', userDefineSchema);
