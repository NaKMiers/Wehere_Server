const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoModel = new Schema(
   {
      userId: String,
      statusText: String,
      video: String,
      heart: [String],
   },
   { timestamps: true }
)

module.exports = mongoose.model('Videos', VideoModel)
