const ShortModel = require('../models/ShortModel')
const UserModel = require('../models/UserModel')
const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/shorts/')
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
   },
})

const upload = multer({ storage }).array('short')

class ShortController {
   // [POST]: /shorts/post
   postShortStatus = async function (req, res) {
      console.log('postShortStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         const statusText = req.body.statusText
         console.log('statusText: ', statusText)
         console.log('req.file: ', req.file)
         console.log('req.files: ', req.files)
         const shortPathList = req.files.map(shortFile => 'shorts/' + shortFile.path.split(`/`)[2])
         console.log('shortPathList: ', shortPathList)
         console.log('shortPathList[0]: ', shortPathList[0])
         if (err) {
            return res.status(500).json(err)
         } else {
            try {
               // get author
               const author = await UserModel.findById(userId)

               // post video
               const shortStatus = ShortModel({ userId, statusText, short: shortPathList[0] })
               const newShortStatus = await shortStatus.save()

               res.status(200).json({ short: newShortStatus, author })
            } catch (err) {
               res.status(500).json(err)
            }
         }
      })
   }

   // [GET]: /shorts/get-shorts-newfeed
   getShortsNewfeed = async function (req, res) {
      console.log('getShortsNewfeed')

      const userId = req.user._id
      console.log('userId: ', userId)
      try {
         // get a friendList
         const curUser = await UserModel.findById(userId)

         // get users from friendList
         let friends = await UserModel.find({ _id: { $in: curUser.friends } })
         friends = friends.concat(curUser)

         // get shorts with each friend from friendList and from my shorts
         const originShorts = await ShortModel.find({
            $or: [{ userId: { $in: curUser.friends } }, { userId: userId }],
         })

         const completedShorts = originShorts.map(s => {
            let friendMatch = friends.find(f => {
               return f._id.toString() === s.userId
            })

            let { createdAt, password, ...other } = friendMatch._doc
            return { short: s, author: other }
         })

         res.status(200).json(completedShorts)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PATCH]: /shorts/like
   likeShortStatus = async function (req, res) {
      console.log('likeShortStatus')

      const { shortId, userId, value } = req.body
      console.log('shortId-userId-userId: ', shortId, userId, value)
      try {
         if (value) {
            await ShortModel.updateOne({ _id: shortId }, { $addToSet: { hearts: userId } })
         } else {
            await ShortModel.updateOne({ _id: shortId }, { $pull: { hearts: userId } })
         }
         res.status(200).json()
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /shorts/delele-short/:shortId
   deleteShortStatus = async function (req, res) {
      console.log('deleteShortStatus')

      const shortId = req.params.shortId
      console.log('shortId: ', shortId)
      try {
         const shortDeleted = await ShortModel.findByIdAndDelete(shortId)
         res.status(200).json(shortDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new ShortController()
