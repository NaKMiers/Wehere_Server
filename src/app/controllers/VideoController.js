const VideoModel = require('../models/VideoModel')
const UserModel = require('../models/UserModel')
const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/videos/')
   },
   filename: (req, file, cb) => {
      let name = Date.now() + '-' + file.originalname
      cb(null, name)
   },
})

const upload = multer({ storage }).array('video')

class VideoController {
   // [POST]: /videos/post
   postVideoStatus = async function (req, res) {
      console.log('postVideoStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         const statusText = req.body.statusText
         console.log('req: ', req)
         console.log('statusText: ', statusText)
         console.log('req.files: ', req.files)
         const videoPathList = req.files.map(videoFile => 'videos/' + videoFile.path.split(`/`)[2])
         console.log('videoPathList: ', videoPathList)
         // console.log('videoPathList[0]: ', videoPathList[0])
         if (err) {
            console.log('err: ', err)
            return res.status(500).json(err)
         } else {
            // try {
            //    // get author
            //    const author = await UserModel.findById(userId)
            //    // post vides
            //    const videoStatus = VideoModel({ userId, statusText, video: videoPathList[0] })
            //    const newVideoStatus = await videoStatus.save()
            //    res.status(200).json({ video: newVideoStatus, author })
            // } catch (err) {
            //    res.status(500).json(err)
            // }
         }
      })
   }

   // [GET]: /videos/get-videos-newfeed
   getVideosNewfeed = async function (req, res) {
      console.log('getVideosNewfeed')

      const userId = req.user._id
      console.log('userId: ', userId)
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

   // [PATCH]: /videos/like
   likeVideoStatus = async function (req, res) {
      console.log('likeVideoStatus')

      const { videoId, userId, value } = req.body
      console.log('videoId-userId-userId: ', videoId, userId, value)
      try {
         if (value) {
            await VideoModel.updateOne({ _id: videoId }, { $addToSet: { hearts: userId } })
         } else {
            await VideoModel.updateOne({ _id: videoId }, { $pull: { hearts: userId } })
         }
         res.status(200).json()
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /videos/delele-video/:videoId
   deleteVideoStatus = async function (req, res) {
      console.log('deleteVideoStatus')

      const videoId = req.params.videoId
      console.log('videoId: ', videoId)
      try {
         const videoDeleted = await VideoModel.findByIdAndDelete(videoId)
         res.status(200).json(videoDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new VideoController()
