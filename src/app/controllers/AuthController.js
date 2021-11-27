const md5 = require('md5')
const UserModel = require('../models/UserModel')

class AuthController {
   // [POST]: /auth/check-users
   checkUser = async function (req, res, next) {
      console.log('checkUser')
      try {
         const matchOtherUsername = await UserModel.find({ username: req.body.username })
         const matchOtherEmail = await UserModel.find({ email: req.body.email })
         res.status(200).json({
            matchOtherUsername: matchOtherUsername.length !== 0, // check array hollow or not
            matchOtherEmail: matchOtherEmail.length !== 0, // check array hollow or not
         })
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /auth/login
   login = async (req, res, next) => {
      console.log('login')
      try {
         const matchUsername = await UserModel.find({ username: req.body.usernameOrEmail })
         const matchEmail = await UserModel.find({ email: req.body.usernameOrEmail })
         let matchPassword = false
         let userLogin

         if (matchUsername.length !== 0) {
            userLogin = matchUsername[0]
            matchPassword = matchUsername[0].password === md5(req.body.password)
         } else if (matchEmail.length !== 0) {
            userLogin = matchEmail[0]
            matchPassword = matchEmail[0].password === md5(req.body.password)
         }

         const { password, updatedAt, ...other } = userLogin._doc
         res.status(200).json({ userLogin: other, matchPassword })
      } catch (err) {
         res.state(200).json(err)
      }
   }

   // [POST]: /auth/create
   createUser = async function (req, res, next) {
      console.log('createUser')
      try {
         const user = new UserModel({ ...req.body, password: md5(req.body.password) })
         const newUser = await user.save()

         const { password, updatedAt, ...other } = newUser._doc
         res.status(200).json(other)
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new AuthController()
