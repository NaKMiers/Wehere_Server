const UserModel = require('../models/UserModel')
const ConversationModel = require('../models/ConversationModel')

class UserController {
   // [GET]: /users/?userId&username
   getUser = async function (req, res, next) {
      console.log('getUser')
      const userId = req.params.userId
      console.log(userId)
      try {
         const user = await UserModel.findById(userId)

         const { password, updatedAt, ...other } = user._doc
         res.status(200).json(other)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PATCH]: /users/change-theme/:userId/:themeIndex
   changeTheme = async function (req, res, next) {
      console.log('changeTheme')
      try {
         const userUpdated = await UserModel.findOneAndUpdate(
            { _id: req.params.userId },
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

   // [PUT]: /users/update-todo-list/:userId/:taskId
   updateTodoList = async function (req, res, next) {
      console.log('updateTodoList')
      try {
         const user = await UserModel.find({ _id: req.params.userId })
         const userUpdated = await UserModel.findOneAndUpdate(
            { _id: req.params.userId },
            {
               ...user,
               todolist: [...user[0].todolist, req.params.taskId],
            },
            { new: true }
         )

         const { password, updatedAt, ...other } = userUpdated._doc
         res.status(200).json(userUpdated)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/add-friend/request/:userId
   addFriendRequest = async function (req, res, next) {
      console.log('addFriendRequest')
      const userRequestId = req.body.curUserId
      const requestedUserId = req.params.userId
      try {
         const userRequest = await UserModel.findById(userRequestId)
         const requestedUser = await UserModel.findById(requestedUserId)
         if (!requestedUser.friends.includes(userRequestId)) {
            const { _id, avatar, username } = userRequest
            const notify = {
               type: 'ADD_FRIEND_REQUEST',
               seen: false,
               userRequest: { _id, avatar, username },
            }
            await requestedUser.updateOne({ $addToSet: { notifications: notify } })

            res.status(200).json('Request sent, please wait for a response.')
         } else {
            res.status(200).json('This user is already your friend.')
         }
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PUT]: /users/add-friend/response/:userId
   addFriendResponse = async function (req, res, next) {
      console.log('addFriendResponse')
      const userRequestId = req.params.userId
      const curUserId = req.body.curUserId
      const value = req.body.value // true(accept)/no(deny)
      try {
         if (value) {
            // add userRequestId to curUser's friendList
            await UserModel.updateOne({ _id: curUserId }, { $addToSet: { friends: userRequestId } })
            // remove curUser notifications
            const curUser = await UserModel.find({ _id: curUserId })
            await UserModel.findOneAndUpdate(
               { _id: curUser[0]._id },
               {
                  ...curUser,
                  notifications: curUser[0].notifications.filter(n => {
                     return n.userRequest._id.toString() !== userRequestId
                  }),
               },
               { new: true }
            )

            // add curUserId to userRequest's friendList
            await UserModel.updateOne({ _id: userRequestId }, { $addToSet: { friends: curUserId } })
            // add notify to userRequest's notifications
            const { _id, username, avatar } = curUser[0]
            const notify = {
               type: 'ADD_FRIEND_ACCEPT',
               userAcceptRequest: { _id, username, avatar },
            }
            await UserModel.updateOne(
               { _id: userRequestId },
               { $addToSet: { notifications: notify } }
            )

            // create new conversation between two user
            const newConversation = new ConversationModel({
               members: [userRequestId, curUserId],
            })
            const savedConversation = await newConversation.save()
         }
         res.status(200).json('User has been your friend.')
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /users/get-friends
   getFriends = async function (req, res, next) {
      console.log('getFriends')
      const curUserFriends = req.body.friends
      try {
         const friends = await UserModel.find({ _id: { $in: curUserFriends } })
         const friendList = friends.map(f => {
            const { password, updatedAt, ...other } = f._doc
            return other
         })

         res.status(200).json(friendList)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new UserController()
