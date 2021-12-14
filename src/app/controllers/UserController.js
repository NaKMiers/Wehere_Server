const hash = require('object-hash')
const UserModel = require('../models/UserModel')
const ConversationModel = require('../models/ConversationModel')
const NotificationModel = require('../models/NotificationModel')

class UserController {
   // [GET]: /users/:userId
   getUser = async function (req, res) {
      console.log('getUser')
      const userId = req.params.userId === 'undefined' ? req.user._id : req.params.userId
      const authGoogleId = req.user.authGoogleId
      const authType = req.user.authType
      try {
         let user
         if (authType === 'local' || req.params.userId) {
            user = await UserModel.findById(userId)
         } else {
            user = await UserModel.findOne({ authGoogleId, authType })
         }

         const { password, updatedAt, ...other } = user._doc
         res.status(200).json(other)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PATCH]: /users/change-theme/:themeIndex
   changeTheme = async function (req, res, next) {
      console.log('changeTheme')
      const userId = req.user._id
      try {
         const userUpdated = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
               $set: {
                  'setting.theme': +req.params.themeIndex,
               },
            },
            { new: true }
         )

         const { password, updatedAt, ...other } = userUpdated._doc
         res.status(200).json(other)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/add-friend/request/:userId
   addFriendRequest = async function (req, res, next) {
      console.log('addFriendRequest')
      const userRequestId = req.user._id
      const requestedUserId = req.params.userId
      try {
         const userRequest = await UserModel.findById(userRequestId)
         const requestedUser = await UserModel.findById(requestedUserId)
         if (
            !requestedUser.friends.includes(userRequestId) &&
            !userRequest.addFriendRequestList.includes(requestedUserId)
         ) {
            // add requestedUserId into userRequest's addFriendRequestList
            await UserModel.updateOne(
               { _id: userRequestId },
               { $addToSet: { addFriendRequestList: requestedUserId } }
            )

            // add new notify to requestedUser
            const notifyData = {
               type: 'ADD_FRIEND_REQUEST',
               senderId: userRequestId,
               senderAvt: userRequest.avatar,
               senderUsername: userRequest.username,
            }
            const newNotify = new NotificationModel(notifyData)
            const savedNotify = await newNotify.save()
            await UserModel.updateOne(
               { _id: requestedUserId },
               {
                  $addToSet: { notifications: savedNotify._id.toString() },
               }
            )
            await UserModel.updateOne({ _id: requestedUserId }, { seenNotifications: false })

            res.status(200).json('Request sent, please wait for a response.')
         } else {
            res.status(200).json('What wrong?')
         }
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/add-friend/response/:userId
   addFriendResponse = async function (req, res, next) {
      console.log('addFriendResponse')
      const userRequestId = req.params.userId
      const curUserId = req.user._id
      const value = req.body.value // true(accept)/no(deny)
      const notifyId = req.body.notifyId
      try {
         if (value) {
            // add userRequestId to curUser's friendList
            const curUser = await UserModel.findOneAndUpdate(
               { _id: curUserId },
               { $addToSet: { friends: userRequestId } },
               { new: true }
            )

            // add curUserId to userRequest's friendList
            await UserModel.updateOne({ _id: userRequestId }, { $addToSet: { friends: curUserId } })
            // add notify to userRequest's notifications
            const notifyData = {
               type: 'ADD_FRIEND_RESPONSE',
               senderId: curUserId,
               senderAvt: curUser.avatar,
               senderUsername: curUser.username,
            }
            const newNotify = new NotificationModel(notifyData)
            const savedNotify = await newNotify.save()
            await UserModel.updateOne(
               { _id: userRequestId },
               {
                  $addToSet: { notifications: savedNotify._id.toString() },
               }
            )
            await UserModel.updateOne({ _id: userRequestId }, { seenNotifications: false })

            // create new conversation between two user
            const isExistCvs = await ConversationModel.find({
               members: { $in: [curUserId], $in: [userRequestId] },
            })
            if (!isExistCvs.length) {
               const newConversation = new ConversationModel({
                  members: [userRequestId, curUserId],
               })
               await newConversation.save()
            }

            res.status(200).json('User has been your friend.')
         }
         // remove curUser notifications
         await NotificationModel.deleteOne({ _id: notifyId })
         await UserModel.updateOne({ _id: curUserId }, { $pull: { notifications: notifyId } })

         // remove curUserId in userRequest's addFriendRequestList
         await UserModel.updateOne(
            { _id: userRequestId },
            { $pull: { addFriendRequestList: curUserId } }
         )
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/seen-notifications
   seenNotifications = async function (req, res, next) {
      console.log('seenNotifications')
      const userId = req.user._id
      try {
         await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: { seenNotifications: true } },
            { new: true }
         )
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/remove-notify/:notifyId
   removeNotify = async function (req, res, next) {
      console.log('removeNotify')
      const curNotifyId = req.params.notifyId
      console.log(curNotifyId)
      try {
         await NotificationModel.deleteOne({ _id: curNotifyId })
         res.status(200).json('Notify has been removed')
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/online-status
   changeOnlineStatus = async function (req, res, next) {
      console.log('changeOnlineStatus')
      const userId = req.user._id
      const status = req.body.status
      try {
         await UserModel.updateOne(
            { _id: userId },
            { $set: { online: status, onlineLated: Date.now() } },
            { new: true }
         )
         res.status(200)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /user/change-password
   changePassword = async function (req, res) {
      console.log('changePassword')
      const userId = req.user._id
      const curPassword = hash(req.body.curPassword)
      const newPassword = hash(req.body.newPassword)
      try {
         let isChangePasswordSuccess = false
         const user = await UserModel.findById(userId)
         console.log(user.password === curPassword)
         if (user.password === curPassword) {
            isChangePasswordSuccess = true
            await UserModel.updateOne({ _id: userId }, { $set: { password: newPassword } })
         }
         res.status(200).json({ isChangePasswordSuccess })
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [GET]: /users/get-friends
   getFriends = async function (req, res) {
      console.log('getFriends')
      const userId = req.user._id
      console.log('userId: ', userId)
      try {
         const curUser = await UserModel.findById(userId)
         let friends = await UserModel.find({ _id: { $in: curUser.friends } })
         friends = friends.map(f => {
            const { password, createdAt, ...other } = f._doc
            return other
         })
         res.status(200).json(friends)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/un-friend/:userId
   unfriend = async function (req, res, next) {
      console.log('unfriend')
      const unfriendedId = req.params.userId
      const curUserId = req.user._id

      try {
         // remove unfriendedId from curUser'sfriends
         await UserModel.updateOne({ _id: curUserId }, { $pull: { friends: unfriendedId } })

         // remove curUserId from unfriended's friends
         await UserModel.updateOne({ _id: unfriendedId }, { $pull: { friends: curUserId } })
         res.status(200).json({ unfriendedId })
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new UserController()
