const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongModel = new Schema(
   {
      userId: String,
      songName: String,
      author: String,
      song: String,
      thumb: String,
      type: { type: String, default: 'songs' },
      favorite: { type: Boolean, default: false },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Songs', SongModel)
