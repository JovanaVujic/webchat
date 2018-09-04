const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Chat schema
const ChatSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ]
});

//export Chat model based on ChatSchema
module.exports = Chat = mongoose.model('chat', ChatSchema);
