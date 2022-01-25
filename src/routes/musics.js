const express = require('express')
const router = express.Router()

const MusicController = require('../app/controllers/MusicController')

router.post('/add-song', MusicController.addSong)
router.get('/get-my-song-list', MusicController.getMySongList)
router.post('/add-playlist', MusicController.addPlaylist)
router.get('/get-my-playlist-list', MusicController.getMyPlaylistList)
router.get('/get-playlist/:playlistId', MusicController.getPlaylist)
router.post('/get-songList-in-playlist', MusicController.getSongListInPlaylist)
router.post('/add-song-to-playlist', MusicController.addSongToPlaylist)
router.patch('/remove-song-from-playlist', MusicController.removeSongFromPlaylist)
router.patch('/mark-favorite-song', MusicController.markFavoriteSong)
router.delete('/delete-song/:songId', MusicController.deleteSong)
router.delete('/delete-playlist/:playlistId', MusicController.deletePlaylist)

module.exports = router
