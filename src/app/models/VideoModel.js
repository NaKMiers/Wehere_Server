const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoModel = new Schema(
   {
      userId: String,
      statusText: String,
      video: String,
      hearts: [String],
      type: { type: String, default: 'video' },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Videos', VideoModel)
