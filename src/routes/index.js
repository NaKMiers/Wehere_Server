const userRouter = require('./users')
const authRouter = require('./auth')
const todoListRouter = require('./todolist')
const conversationRouter = require('./conversation')
const messageRouter = require('./message')
const notificationRouter = require('./notification')
const diaryRouter = require('./diary')
const imageRouter = require('./images')
const blogRouter = require('./blogs')

const authMiddleware = require('../app/middlewares/authMiddleware')

function routes(app) {
   app.use('/auth', authRouter)

   app.use('/users', authMiddleware, userRouter)

   app.use('/todo-list', authMiddleware, todoListRouter)

   app.use('/conversations', conversationRouter)

   app.use('/messages', messageRouter)

   app.use('/notifications', notificationRouter)

   app.use('/diaries', authMiddleware, diaryRouter)

   app.use('/images', imageRouter)

   app.use('/blogs', blogRouter)

   app.use('/', (req, res) => {
      res.send('This is home page')
   })
}

module.exports = routes
