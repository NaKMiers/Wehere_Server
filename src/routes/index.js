const usersRouter = require('./users')
const authRouter = require('./auth')
const todoListRouter = require('./todolist')
const conversationRouter = require('./conversation')
const messageRouter = require('./message')

function routes(app) {
   app.use('/users', usersRouter)

   app.use('/auth', authRouter)

   app.use('/todo-list', todoListRouter)

   app.use('/conversations', conversationRouter)

   app.use('/messages', messageRouter)

   app.use('/', (req, res) => {
      res.send('This is home page')
   })
}

module.exports = routes
