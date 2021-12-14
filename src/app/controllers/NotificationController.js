const NotificationModel = require('../models/NotificationModel')

class NotificationController {
   // [GET]: /notifications
   getNotifications = async function (req, res, next) {
      console.log('getNotifications')
      const notificationList = req.body.notificationList
      try {
         const notifications = await NotificationModel.find({ _id: { $in: notificationList } })
         res.status(200).json(notifications)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /notifications/new-notify
   newNotify = async function (req, res, next) {
      console.log('newNotify')
      try {
         const newNotify = new NotificationModel(req.body)
         const savedNotify = await newNotify.save()
         res.status(200).json(savedNotify)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [DELETE]: /notifications/remove-notify/:notifyId
   removeNotify = async function (req, res, next) {
      console.log('removeNotify')
      const notifyId = req.params.notifyId
      try {
         const notifyDeleted = await NotificationModel.findOneAndDelete({ _id: notifyId })
         res.status(200).json(notifyDeleted)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new NotificationController()
