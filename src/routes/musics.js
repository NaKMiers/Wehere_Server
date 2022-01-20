const express = require('express')
const router = express.Router()

const MusicController = require('../app/controllers/MusicController')
const authMiddleware = require('../app/middlewares/authMiddleware')

router.post('/add-song', authMiddleware, MusicController.addSong)
router.get('/get-my-song-list', authMiddleware, MusicController.getMySongList)
router.post('/add-playlist', authMiddleware, MusicController.addPlaylist)
router.get('/get-my-playlist-list', authMiddleware, MusicController.getMyPlaylistList)

module.exports = router
