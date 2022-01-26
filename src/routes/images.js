const express = require('express')
const router = express.Router()

const ImageController = require('../app/controllers/ImageController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.get('/get-images-newfeed', authMiddleware, ImageController.getImagesNewfeed)
router.post('/post', authMiddleware, ImageController.postImageStatus)
router.patch('/like', authMiddleware, ImageController.likeImageStatus)

module.exports = router
