require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const db = require('./config/db')

// app
const app = express()

// apply middlewares
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(cors())

// routes
routes(app)

// database
db.connect()

app.listen(process.env.PORT, () => {
   console.log('Server running on port: ' + process.env.PORT)
})
