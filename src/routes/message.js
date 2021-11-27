const express = require('express')
const router = express.Router()

const MessageController = require('../app/controllers/MessageController')

router.get('/:conversationId', MessageController.getMessage)
router.post('/new-message', MessageController.newMessage)

module.exports = router
