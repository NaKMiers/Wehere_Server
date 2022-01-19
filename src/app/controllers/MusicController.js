const MusicModel = require('../models/MusicModel')
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
   // [POST]: /musics/add
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
               const newSong = MusicModel({
                  userId,
                  songName,
                  author,
                  song: songPath,
                  thumb: thumbPath,
               })
               await newSong.save()
               res.status(200).json('New song has been added.')
            } catch (err) {
               console.log(err)
               res.status(500).json(err)
            }
         }
      })
   }
}

module.exports = new MusicController()
