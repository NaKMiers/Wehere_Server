const express = require('express')
const routes = require('.')
const router = express.Router()

const UserController = require('../app/controllers/UserController')

router.get('/:userId', UserController.getUser)
router.put('/change-theme/:userId/:themeIndex', UserController.changeTheme)
router.put('/update-todo-list/:userId/:taskId', UserController.updateTodoList)
router.put('/add-friend/request/:userId', UserController.addFriendRequest)
router.put('/add-friend/response/:userId', UserController.addFriendResponse)
router.post('/get-friends', UserController.getFriends)

module.exports = router
