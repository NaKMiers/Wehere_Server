const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConversationModel = new Schema(
   {
      members: Array,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Conversations', ConversationModel)
