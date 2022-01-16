const ImageModel = require('../models/ImageModel')
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
         console.log('req.body', req.body)
         console.log('req.files', req.files)
         const statusText = req.body.statusText
         const imagePathList = req.files.map(
            (imageFile, i) => 'images/' + imageFile.path.split(`\\`)[2]
         )

         console.log(imagePathList)

         if (err) {
            return res.status(500).json(err)
         } else {
            try {
               const imageStatus = ImageModel({ userId, statusText, images: imagePathList })
               await imageStatus.save()
               res.status(200).json('ImageStatus has been created.')
            } catch (err) {
               res.status(500).json(err)
            }
         }
      })
   }
}

module.exports = new ImageController()
