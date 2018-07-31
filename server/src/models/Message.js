const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const MessageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: "chat"
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model("message", MessageSchema);
