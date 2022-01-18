const express = require('express')
const router = express.Router()

const VideoController = require('../app/controllers/VideoController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.get('/get-videos-newfeed', authMiddleware, VideoController.getVideosNewfeed)
router.post('/post', authMiddleware, VideoController.postVideoStatus)

module.exports = router
