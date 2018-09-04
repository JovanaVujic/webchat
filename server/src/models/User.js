const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export User model based on UserSchema
module.exports = User = mongoose.model('users', UserSchema);
