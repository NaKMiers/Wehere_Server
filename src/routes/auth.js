const express = require('express')
const routes = require('.')
const router = express.Router()

const AuthController = require('../app/controllers/AuthController')

router.post('/create', AuthController.createUser)
router.post('/check-user', AuthController.checkUser)
router.post('/login', AuthController.login)

module.exports = router
