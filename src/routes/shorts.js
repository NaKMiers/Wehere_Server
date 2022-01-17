const express = require('express')
const router = express.Router()

const ShortController = require('../app/controllers/ShortController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/post', authMiddleware, ShortController.postShortStatus)

module.exports = router
