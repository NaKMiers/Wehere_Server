const ImageModel = require('../models/ImageModel')
const UserModel = require('../models/UserModel')
const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/images/')
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
   },
})

const upload = multer({ storage }).array('image')

class ImageController {
   // [POST]: /images/post
   postImageStatus = async function (req, res) {
      console.log('postImageStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         const statusText = req.body.statusText
         console.log('statusText: ', statusText)
         console.log('req.files: ', req.files)
         console.log('req.file: ', req.files)
         const imagePathList = req.files.map(imageFile => 'images/' + imageFile.path.split(`/`)[2])
         console.log('imagePathList: ', imagePathList)

         if (err) {
            return res.status(500).json(err)
         } else {
            try {
               // get author
               const author = await UserModel.findById(userId)

               // post vides
               const imageStatus = ImageModel({ userId, statusText, images: imagePathList })
               const newImageStatus = await imageStatus.save()

               res.status(200).json({ image: newImageStatus, author })
            } catch (err) {
               res.status(500).json(err)
            }
         }
      })
   }

   // [GET]: /images/get-images-newfeed
   getImagesNewfeed = async function (req, res) {
      console.log('getImagesNewfeed')

      const userId = req.user._id
      console.log('userId: ', userId)
      try {
         // get a friendList
         const curUser = await UserModel.findById(userId)

         // get users from friendList
         let friends = await UserModel.find({ _id: { $in: curUser.friends } })
         friends = friends.concat(curUser)

         // get images with each friend from friendList and from my images
         const originImages = await ImageModel.find({
            $or: [{ userId: { $in: curUser.friends } }, { userId: userId }],
         })

         const completedImages = originImages.map(img => {
            let friendMatch = friends.find(f => {
               return f._id.toString() === img.userId
            })

            let { createdAt, password, ...other } = friendMatch._doc
            return { image: img, author: other }
         })

         res.status(200).json(completedImages)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PATCH]: /images/like
   likeImageStatus = async function (req, res) {
      console.log('getBlogNewFeed')

      const { imageId, userId, value } = req.body
      console.log('imageId-userId-userId: ', imageId, userId, value)
      try {
         if (value) {
            await ImageModel.updateOne({ _id: imageId }, { $addToSet: { hearts: userId } })
         } else {
            await ImageModel.updateOne({ _id: imageId }, { $pull: { hearts: userId } })
         }
         res.status(200).json()
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /images/delele-image/:imageId
   deleteImageStatus = async function (req, res) {
      console.log('deleteImageStatus')

      const imageId = req.params.imageId
      console.log('imageId: ', imageId)
      try {
         const imageDeleted = await ImageModel.findByIdAndDelete(imageId)
         res.status(200).json(imageDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new ImageController()
