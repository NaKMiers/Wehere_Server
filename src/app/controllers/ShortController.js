const ShortModel = require('../models/ShortModel')
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
   // [POST]: /videos/post
   postShortStatus = async function (req, res) {
      console.log('postShortStatus')
      const userId = req.user._id

      upload(req, res, async err => {
         console.log('req.body', req.body)
         console.log('req.file', req.file)
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
}

module.exports = new ShortController()
