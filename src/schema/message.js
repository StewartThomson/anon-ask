var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  sender_id: String,
  message_id: String,
  message_body: String,
  channel_sent_to: String
});

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;
