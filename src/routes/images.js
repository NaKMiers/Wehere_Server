const express = require('express')
const router = express.Router()

const ImageController = require('../app/controllers/ImageController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/post', authMiddleware, ImageController.postImageStatus)

module.exports = router
