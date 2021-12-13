const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = new Schema(
   {
      username: String,
      email: String,
      password: String,
      avatar: { type: String, default: 'https://bom.so/CRZ2w9' },
      background: { type: String, default: 'https://bom.so/6K8pK7' },
      authType: {
         type: String,
         enum: ['local', 'google', 'facebook'],
         default: 'local',
      },
      authGoogleId: { type: String, default: null },
      authFacebookId: { type: String, default: null },
      birthDate: { type: String, default: '1/1/2004' },
      gender: String,
      maritalStatus: String,
      live: String,
      experiences: Number,
      online: { type: Boolean, default: false },
      onlineLated: { type: Date, default: Date.now() },
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
      seenNotifications: { type: Boolean, default: false },
      notifications: Array,
      justTextedRecently: Array,
      addFriendRequestList: Array,
   },
   { timestamps: true }
)

module.exports = mongoose.model('Users', UserModel)
