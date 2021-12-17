require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const db = require('./config/db')

// app
const app = express()

// apply middlewares
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())

// routes
routes(app)

// database
db.connect()

app.listen(process.env.PORT, () => {
   console.log('Server running at port: ' + process.env.PORT)
})
