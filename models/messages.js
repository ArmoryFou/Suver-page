const mongoose=require('mongoose');
const messageSchema = new mongoose.Schema({
    media: String,
    text: String,
    type: String,
    createdAt: Date,
});
  
const Message = mongoose.model("messages", messageSchema);

module.exports = Message;