const hash = require('object-hash')
const jwt = require('jsonwebtoken')
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
   login = async function (req, res, next) {
      console.log('login')
      const username = req.body.usernameOrEmail
      const email = req.body.usernameOrEmail
      const pw = hash(req.body.password)

      try {
         const matchUsername = await UserModel.find({ username: username })
         const matchEmail = await UserModel.find({ email: email })
         let matchPassword = false
         let userLogin

         if (matchUsername.length !== 0) {
            userLogin = matchUsername[0]
            matchPassword = matchUsername[0].password === pw
         } else if (matchEmail.length !== 0) {
            userLogin = matchEmail[0]
            matchPassword = matchEmail[0].password === pw
         }

         const token = jwt.sign(
            {
               _id: userLogin._id.toString(),
               username: userLogin.username,
               email: userLogin.email,
               authType: userLogin.authType,
               authGoogleId: userLogin.authGoogleId,
               authFacebookId: userLogin.authFacebookId,
               avatar: userLogin.avatar,
               admin: false,
            },
            process.env.AUTHORIZATION_SECRECT_KEY
         )

         const { password, updatedAt, ...other } = userLogin._doc
         res.status(200).json({ userLogin: other, matchPassword, token })
      } catch (err) {
         res.status(200).json(err)
      }
   }

   // [POST]: /auth/sign-in-with-social
   signInWithSocical = async function (req, res, next) {
      console.log('signInWithSocical')
      const toUsername = str => {
         const AccentsMap = [
            'aàảãáạăằẳẵắặâầẩẫấậ',
            'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
            'dđ',
            'DĐ',
            'eèẻẽéẹêềểễếệ',
            'EÈẺẼÉẸÊỀỂỄẾỆ',
            'iìỉĩíị',
            'IÌỈĨÍỊ',
            'oòỏõóọôồổỗốộơờởỡớợ',
            'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
            'uùủũúụưừửữứự',
            'UÙỦŨÚỤƯỪỬỮỨỰ',
            'yỳỷỹýỵ',
            'YỲỶỸÝỴ',
         ]
         for (let i = 0; i < AccentsMap.length; i++) {
            let re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
            let char = AccentsMap[i][0]
            str = str.replace(re, char).split(' ').join('').toLowerCase()
         }
         return str
      }

      const data = jwt.decode(req.body.stsTokenManager.accessToken)
      try {
         let userLogin
         // check if this user exists
         const existedUser = await UserModel.findOne({
            authGoogleId: data.user_id,
            authType: 'google',
         })
         if (existedUser) {
            // if this user is exist then return this user
            await UserModel.updateOne(
               { _id: existedUser._id.toString() },
               { $set: { email: data.email, username: toUsername(data.name) } }
            )
            let { password, updatedAt, ...other } = existedUser._doc
            userLogin = other
         } else {
            // if this user is not exist then create new user and return new user
            const user = new UserModel({
               authType: 'google',
               email: data.email,
               username: toUsername(data.name),
               authGoogleId: data.user_id,
            })
            const newUser = await user.save()

            let { password, updatedAt, ...other } = newUser._doc
            userLogin = other
         }

         const token = jwt.sign(
            {
               _id: userLogin._id.toString(),
               username: userLogin.username,
               email: userLogin.email,
               authType: userLogin.authType,
               authGoogleId: userLogin.authGoogleId,
               authFacebookId: userLogin.authFacebookId,
               avatar: userLogin.avatar,
               admin: false,
            },
            process.env.AUTHORIZATION_SECRECT_KEY
         )

         res.status(200).json({ userLogin, token })
      } catch (err) {
         res.status(500).json(err)
      }
   }

   // [POST]: /auth/create
   createUser = async function (req, res, next) {
      console.log('createUser')
      const pw = hash(req.body.password)
      try {
         const user = new UserModel({ ...req.body, password: pw })
         const newUser = await user.save()

         const token = jwt.sign(
            {
               _id: newUser._id.toString(),
               username: newUser.username,
               email: newUser.email,
               authType: newUser.authType,
               authGoogleId: newUser.authGoogleId,
               authFacebookId: newUser.authFacebookId,
               avatar: newUser.avatar,
               admin: false,
            },
            process.env.AUTHORIZATION_SECRECT_KEY
         )

         const { password, updatedAt, ...other } = newUser._doc
         res.status(200).json({ ...other, token })
      } catch (err) {
         res.status(500).json(err)
      }
   }
}

module.exports = new AuthController()
