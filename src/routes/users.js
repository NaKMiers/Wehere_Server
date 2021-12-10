const express = require('express')
const router = express.Router()

const UserController = require('../app/controllers/UserController')

router.get('/:userId', UserController.getUser)
router.put('/change-theme/:themeIndex', UserController.changeTheme)
router.put('/update-todo-list/:taskId', UserController.updateTodoList)
router.put('/add-friend/request/:userId', UserController.addFriendRequest)
router.put('/add-friend/response/:userId', UserController.addFriendResponse)
router.put('/seen-notifications', UserController.seenNotifications)

module.exports = router
