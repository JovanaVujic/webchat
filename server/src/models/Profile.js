const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Profile schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  avatar: {
    type: String
  },
  status: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export Profile model based on ProfileSchema
module.exports = Profile = mongoose.model('profile', ProfileSchema);
