const ImageModel = require('../models/ImageModel')

class ImageController {
   // [POST]: /images/post
   postImageStatus = async function (req, res) {
      console.log('postImageStatus')
      const userId = req.user._id
      const data = req.body
      try {
         const imageStatus = ImageModel({ ...data, userId })
         await imageStatus.save()
         res.status(200).json('ImageStatus has been created.')
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new ImageController()
