const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
const ConversationModel = require('../models/ConversationModel')
const NotificationModel = require('../models/NotificationModel')

class UserController {
   // [GET]: /users/:userId
   getUser = async function (req, res) {
      console.log('getUser')
      const userId = req.params.userId
      try {
         const user = await UserModel.findById(userId)

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

   // [PUT]: /users/update-todo-list/:taskId
   updateTodoList = async function (req, res, next) {
      console.log('updateTodoList')
      const userId = req.user._id
      const taskId = req.params.taskId
      try {
         const userUpdated = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { todolist: taskId } },
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
            const newConversation = new ConversationModel({
               members: [userRequestId, curUserId],
            })
            await newConversation.save()
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
}

module.exports = new UserController()
