const express = require('express')
const router = express.Router()

const MusicController = require('../app/controllers/MusicController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/add', authMiddleware, MusicController.addSong)

module.exports = router
