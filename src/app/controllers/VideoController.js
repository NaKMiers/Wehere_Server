const VideoModel = require('../models/VideoModel')
const UserModel = require('../models/UserModel')
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
               const videoStatus = VideoModel({ userId, statusText, video: videoPath })
               await videoStatus.save()
               res.status(200).json('VideoStatus has been created.')
            } catch (err) {
               res.status(500).json(err)
            }
         }
      })
   }

   // [GET]: /videos/get-videos-newfeed
   getVideosNewfeed = async function (req, res) {
      console.log('getVideosNewfeed')

      const userId = req.user._id
      try {
         // get a friendList
         const curUser = await UserModel.findById(userId)

         // get users from friendList
         let friends = await UserModel.find({ _id: { $in: curUser.friends } })
         friends = friends.concat(curUser)

         // get videos with each friend from friendList and from my videos
         const originVideos = await VideoModel.find({
            $or: [{ userId: { $in: curUser.friends } }, { userId: userId }],
         })

         const completedVideos = originVideos.map(v => {
            let friendMatch = friends.find(f => {
               return f._id.toString() === v.userId
            })

            let { createdAt, password, ...other } = friendMatch._doc
            return { video: v, author: other }
         })

         res.status(200).json(completedVideos)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new VideoController()
