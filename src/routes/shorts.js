const express = require('express')
const router = express.Router()

const ShortController = require('../app/controllers/ShortController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.get('/get-shorts-newfeed', authMiddleware, ShortController.getShortsNewfeed)
router.post('/post', authMiddleware, ShortController.postShortStatus)
router.patch('/like', authMiddleware, ShortController.likeShortStatus)
router.delete('/delete-short/:shortId', authMiddleware, ShortController.deleteShortStatus)

module.exports = router
