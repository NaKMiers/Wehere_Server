const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationModel = new Schema(
   {
      type: String,
      seen: { type: Boolean, default: false },
      senderId: String,
      senderAvt: String,
      senderUsername: String,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Notifications', NotificationModel)
