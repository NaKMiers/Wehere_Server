const express = require('express')
const router = express.Router()

const NotificationController = require('../app/controllers/NotificationController')

router.post('/', NotificationController.getNotifications)
router.post('/new-notify', NotificationController.newNotify)
router.delete('/remove-notify/:notifyId', NotificationController.removeNotify)

module.exports = router
