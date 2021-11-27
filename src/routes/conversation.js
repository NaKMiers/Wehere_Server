const express = require('express')
const router = express.Router()

const ConversationController = require('../app/controllers/ConversationController')

router.get('/:userId', ConversationController.getConversation)
router.post('/new-conversation', ConversationController.newConversation)

module.exports = router
