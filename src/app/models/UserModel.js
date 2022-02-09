const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserModel = new Schema(
   {
      username: String,
      email: String,
      password: String,
      avatar: { type: String, default: 'avatars/avatarDefault.png' },
      background: { type: String, default: 'backgrounds/backgroundDefault.jpg' },
      authType: {
         type: String,
         enum: ['local', 'google', 'facebook'],
         default: 'local',
      },
      authGoogleId: { type: String, default: null },
      authFacebookId: { type: String, default: null },
      birthdate: { type: String, default: 'unknow' },
      gender: { type: String, default: 'unknow' },
      maritalStatus: { type: String, default: 'unknow' },
      live: { type: String, default: 'unknow' },
      experiences: Number,
      online: { type: Boolean, default: false },
      onlineLated: { type: Date, default: Date.now() },
      songs: Array,
      playlists: Array,
      friends: { type: Array, default: ['6203978d172a867db4071ed4'] },
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
