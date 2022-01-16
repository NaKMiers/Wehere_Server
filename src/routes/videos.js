const express = require('express')
const router = express.Router()

const VideoController = require('../app/controllers/VideoController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/post', authMiddleware, VideoController.postVideoStatus)

module.exports = router
