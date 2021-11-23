const md5 = require('md5')
const UserModel = require('../models/UserModel')

class UserController {
   // [GET]: /users/:userId/
   getUser = async function (req, res, next) {
      console.log('getUser')
      try {
         const user = await UserModel.find({ _id: req.params.userId })
         res.status(200).json(user)
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [PATCH]: /users/change-theme/:userId/:themeIndex
   changeTheme = async function (req, res, next) {
      console.log('changeTheme')
      try {
         const user = await UserModel.find({ _id: req.params.userId })
         const userUpdated = await UserModel.findOneAndUpdate(
            { _id: req.params.userId },
            {
               ...user,
               setting: {
                  ...user.setting,
                  theme: +req.params.themeIndex,
               },
            },
            { new: true }
         )
         res.status(200).json(userUpdated)
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
         res.status(200).json(userUpdated)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new UserController()
