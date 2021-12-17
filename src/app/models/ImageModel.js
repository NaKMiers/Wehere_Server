const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageModel = new Schema(
   {
      userId: String,
      statusText: String,
      images: [String],
      heart: [String],
   },
   { timestamps: true }
)

module.exports = mongoose.model('Images', ImageModel)
