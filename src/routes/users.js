const express = require('express')
const routes = require('.')
const router = express.Router()

const UserController = require('../app/controllers/UserController')

router.get('/:userId', UserController.getUser)
router.put('/change-theme/:userId/:themeIndex', UserController.changeTheme)

module.exports = router
