const express = require('express')
const router = express.Router()

const UserController = require('../app/controllers/UserController')

router.post('/get-friends', UserController.getFriends)
router.put('/change-theme/:themeIndex', UserController.changeTheme)
router.put('/add-friend/request/:userId', UserController.addFriendRequest)
router.put('/add-friend/response/:userId', UserController.addFriendResponse)
router.put('/un-friend/:userId', UserController.unfriend)
router.put('/remove-notify/:notifyId', UserController.removeNotify)
router.put('/seen-notifications', UserController.seenNotifications)
router.put('/online-status', UserController.changeOnlineStatus)
router.put('/change-password', UserController.changePassword)
router.get('/:userId', UserController.getUser)
router.post('/get-accounts', UserController.getAccounts)
router.put('/update-avatar', UserController.updateAvatar)
router.put('/update-background', UserController.updateBackground)

module.exports = router
