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

const upload = multer({ storage }).single('short')

class ShortController {
   // [POST]: /shorts/post
   postShortStatus = async function (req, res) {
      console.log('postShortStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         const statusText = req.body.statusText
         const shortPath = 'shorts/' + req.file.path.split(`\\`)[2]
         if (err) {
            return res.status(500).json(err)
         } else {
            try {
               const shortStatus = ShortModel({ userId, statusText, short: shortPath })
               await shortStatus.save()
               res.status(200).json('ShortStatus has been created.')
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
}

module.exports = new ShortController()
