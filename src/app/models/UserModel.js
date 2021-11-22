const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = new Schema(
   {
      name: String,
      username: String,
      email: String,
      password: String,
      avatar: { type: String, default: 'https://bom.to/ueUL3N' },
      experiences: Number,
      online: { type: Boolean, default: false },
      blogs: Array,
      images: Array,
      videos: Array,
      shorts: Array,
      todolist: Array,
      diaries: Array,
      songs: Array,
      playlists: Array,
      friends: Array,
      saved: Array,
      setting: {
         theme: { type: Number, default: 0 },
      },
      notifications: Array,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Users', UserModel)
