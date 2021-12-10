const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
   const authHeader = req.headers.authorization
   const token = authHeader && authHeader.split(' ')[1]
   if (!token) return res.status(401)

   jwt.verify(token, process.env.AUTHORIZATION_SECRECT_KEY, (err, user) => {
      if (err) return res.sendStatus(403)

      req.user = user
      next()
   })
}

module.exports = authMiddleware
