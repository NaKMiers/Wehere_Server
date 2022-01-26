const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortModel = new Schema(
   {
      userId: String,
      statusText: String,
      short: String,
      hearts: [String],
      type: { type: String, default: 'short' },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Shorts', ShortModel)
