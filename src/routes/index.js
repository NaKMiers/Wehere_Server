const usersRouter = require('./users')
const authRouter = require('./auth')
const todoListRouter = require('./todolist')

function routes(app) {
   app.use('/users', usersRouter)

   app.use('/auth', authRouter)

   app.use('/todo-list', todoListRouter)

   app.use('/', (req, res) => {
      res.send('This is home page')
   })
}

module.exports = routes
