const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MusicModel = new Schema(
   {
      userId: String,
      songName: String,
      author: String,
      song: String,
      thumb: String,
      type: { type: String, default: 'music' },
      favorite: Boolean,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Musics', MusicModel)
