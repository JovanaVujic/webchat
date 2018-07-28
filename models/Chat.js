const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const ChatSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
});

module.exports = Chat = mongoose.model('chat', ChatSchema);
