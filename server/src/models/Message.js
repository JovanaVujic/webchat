const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Message schema
const MessageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'chat'
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export Message model based on MessageSchema
module.exports = Message = mongoose.model('message', MessageSchema);
