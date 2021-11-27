const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageModel = new Schema(
   {
      conversationId: String,
      sender: String,
      text: String,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Messages', MessageModel)
