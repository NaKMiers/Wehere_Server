const SongModel = require('../models/SongModel')
const PlaylistModel = require('../models/PlaylistModel')
const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/musics')
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
   },
})

const upload = multer({ storage }).array('song')
// const uploadImage = multer({ storageImage }).single('image')

class MusicController {
   // [POST]: /musics/add-song
   addSong = async function (req, res) {
      console.log('addSong')

      const userId = req.user._id
      upload(req, res, async err => {
         const songName = req.body.songName
         const author = req.body.author
         const songPath = 'musics/' + req.files[0].path.split(`\\`)[2]
         const thumbPath = 'musics/' + req.files[1].path.split(`\\`)[2]
         if (err) {
            console.log('err: ', err)
            return res.status(500).json(err)
         } else {
            try {
               const song = SongModel({
                  userId,
                  songName,
                  author,
                  song: songPath,
                  thumb: thumbPath,
               })
               const newSong = await song.save()
               res.status(200).json(newSong)
            } catch (err) {
               console.log(err)
               res.status(500).json(err)
            }
         }
      })
   }

   // [GET]: /musics/get-my-song-list
   getMySongList = async function (req, res) {
      console.log('getMySongList')

      const userId = req.user._id
      try {
         const songList = await SongModel.find({ userId })
         res.status(200).json(songList)
      } catch (err) {
         res.status(500).json(500)
      }
   }

   // [POST]: /musics/add-playlist
   addPlaylist = async function (req, res) {
      console.log('addPlaylist')

      const userId = req.user._id
      const playlistName = req.body.playlistName
      const songs = req.body.songs

      let songList = await SongModel.find({ _id: { $in: songs } })
      songList = songList.splice(0, 4)
      const thumbs = songList.map(s => s.thumb)
      try {
         const playlist = PlaylistModel({ userId, playlistName, songs, thumbs })
         const newPlaylist = await playlist.save()
         res.status(200).json(newPlaylist)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [GET]: /musics/get-my-playlist-list
   getMyPlaylistList = async function (req, res) {
      console.log('getMyPlaylistList')

      const userId = req.user._id
      try {
         const playlistList = await PlaylistModel.find({ userId })
         res.status(200).json(playlistList)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [GET]: /musics/get-playlist/:playlistId
   getPlaylist = async function (req, res) {
      console.log('getPlaylist')

      const playlistId = req.params.playlistId
      try {
         const playlist = await PlaylistModel.findById(playlistId)
         res.status(200).json(playlist)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new MusicController()
