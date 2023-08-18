require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const ConnectDatabase = require('./config/database')

// app
const app = express()

app.use(
   cors({
      origin: process.env.CLIENT_ACCEPTED,
      methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
   })
)

// static files
app.use(express.static(path.resolve(process.cwd(), 'public')))

// apply middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({}))

// routes
routes(app)

// connect database
ConnectDatabase()

// listener
const POST = process.env.PORT || 3001
app.listen(POST, () => console.log('Server running at port: ' + POST))
