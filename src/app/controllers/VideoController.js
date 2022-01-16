const VideoModal = require('../models/VideoModal')
const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/videos/')
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
   },
})

const upload = multer({ storage }).single('video')

class VideoController {
   // [POST]: /videos/post
   postVideoStatus = async function (req, res) {
      console.log('postVideoStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         const statusText = req.body.statusText
         const videoPath = 'videos/' + req.file.path.split(`\\`)[2]
         if (err) {
            return res.status(500).json(err)
         } else {
            try {
               const videoStatus = VideoModal({ userId, statusText, video: videoPath })
               await videoStatus.save()
               res.status(200).json('VideoStatus has been created.')
            } catch (err) {
               res.status(500).json(err)
            }
         }
      })
   }
}

module.exports = new VideoController()
