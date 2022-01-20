const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistModel = new Schema(
   {
      userId: String,
      playlistName: String,
      songs: [String],
      thumbs: [String],
      favorite: { type: Boolean, default: false },
   },
   { timestamps: true }
)

module.exports = mongoose.model('Playlists', PlaylistModel)
