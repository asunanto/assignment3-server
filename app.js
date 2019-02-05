// dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const logger = require('morgan') -- log each request
// const bodyParser = require('body-parser') -- a middleware to parse the request.body
const fileUpload = require('express-fileupload')
const path = require('path') // built-in node module that provides utilities for working with file and directory paths
require('dotenv').config()

const {
  initializePassport,
  passportSession
} = require('./middleware/auth')

const app = express()

const dbConn = 'mongodb://localhost/assignment-3'
// const dbConn = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds257564.mlab.com:57564/assignment-3`


// view engine setup
// path.join method joins the __dirname and views into one path.
app.set('views', path.join(__dirname, 'views'))


// parse json
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())


app.use(initializePassport)
app.use(passportSession)
// app.use(aclAuthorize)
app.use(cors())
app.use(session({
  secret: "these are not the droids you're looking for",
}))
app.use(fileUpload())
// Uses express.static build-in middleware function to serve files/assets from the "public" directory.
app.use('/public', express.static(__dirname + '/public'))

// mongoose
mongoose.connect(dbConn, (err) => {
  if (err) {
    console.log('Error connecting to database', err)
  } else {
    console.log('Connected to database!')
  }
})

// Use defined routes
app.use('/auth', require('./routes/auth'))
// app.use('/admin', require('./routes/admin'))
app.use('/programs', require('./routes/programs'))
app.use('/activities', require('./routes/activities'))
app.use('/units', require('./routes/units'))
app.use('/users', require('./routes/users'))
app.use('/agelevels', require('./routes/ageLevels'))

app.get('/', (req, res) => {
  res.status(200).send('Bookmark server')
})

// Hitting /upload with a POST request copies the file to "/public/files/fileName.ext".
app.post('/upload', (req, res, next) => {
  // The file will be sent appended to the file key from the frontend.
  let uploadFile = req.files.file // access the file
  const fileName = req.files.file.name // access the filename
  uploadFile.mv(
    `${__dirname}/public/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.json({
        file: `public/${req.files.file.name}`,
      })
    },
  )
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(process.env.PORT || 3001, () => console.log('Listening on http://localhost:3001'))