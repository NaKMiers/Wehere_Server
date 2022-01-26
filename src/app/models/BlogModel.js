const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogModel = new Schema(
   {
      userId: String,
      statusText: String,
      hearts: [String],
      type: { type: String, default: 'blog' },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Blogs', BlogModel)
