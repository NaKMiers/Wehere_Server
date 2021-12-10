const usersRouter = require('./users')
const authRouter = require('./auth')
const todoListRouter = require('./todolist')
const conversationRouter = require('./conversation')
const messageRouter = require('./message')
const notificationRouter = require('./notification')

const authMiddleware = require('../app/middlewares/authMiddleware')

function routes(app) {
   app.use('/auth', authRouter)

   app.use('/users', authMiddleware, usersRouter)

   app.use('/todo-list', authMiddleware, todoListRouter)

   app.use('/conversations', conversationRouter)

   app.use('/messages', messageRouter)

   app.use('/notifications', notificationRouter)

   app.use('/', (req, res) => {
      res.send('This is home page')
   })
}

module.exports = routes
