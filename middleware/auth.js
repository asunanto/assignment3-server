const passport = require('passport')
const User = require('../models/user')
const JWT = require('jsonwebtoken')
const PassportJwt = require('passport-jwt')
const Unit = require('../models/unit')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET
const jwtAlgorithm = 'HS256'
const jwtExpiresIn = '3h'

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy())

passport.use(new PassportJwt.Strategy({
  jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  algorithms: [jwtAlgorithm]
}, (payload, done) => {
  User.findById(payload.sub).then((user) => {
    if (user) {
      user.token = payload
      done(null,user)
    } else{
      done(null, false)
    }
  }).catch((error) => {
    done(error,false)
  })
}))

const signJwtForUser = (req,res) => {
  const token = JWT.sign(
    //payload
    {
      sub: req.user._id.toString(),
      email: req.user.email
    },
    //secret
    jwtSecret,
    //config
    {
      algorithm: jwtAlgorithm,
      expiresIn: jwtExpiresIn
    }
  )
  res.json({token: token})
}

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const register = (req, res, next) => {
  //   const addUserToUnit = await Unit.findByIdAndUpdate(
//     req.params.id, 
//     {$addToSet: {users: req.user._id}}, // addToSet adds an element to a field
//     {new: true} // setting to return the updated property
//     )
//   if (!addUserToUnit) res.status(404).json({
//     error: "Unit Id not found"
//   })
//   res.json(addUserToUnit)
  req.body.role = req.body.role || 'user'
  User.register(new User(req.body), req.body.password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    Unit.findByIdAndUpdate(req.body.unit, {
      $addToSet: {
        users: req.body
      }
    }).then()
    .catch((err) => res.json({err}))
    // res.status(200).json(user)
    req.user = user
    next()
  })
}

// const login = (req, res, next) => {
//   // Set the session role to the user role so we can use it for authorization
//   req.session.role = req.user.role || 'guest' // default to guest if no user or role
//   // res.status(200).json(req.user)
//   next()
// }

// Logout the current user
const logout = (req, res) => {
  req.logout()
  req.session.role = 'guest'
  res.sendStatus(200)
}

// Used as middleware to check if the currently logged in user has admin role
const isAdmin = (req, res, next) => {
  if (req.session.role && req.session.role === 'admin') {
    next()
  } else {
    res.sendStatus(403)
  }
}

const isRegisteredUser = (req, res, next) => {
  if (req.session.role && (req.session.role == 'user' || req.session.role == 'admin')) {
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = {
  initializePassport: passport.initialize(),
  passportSession: passport.session(),
  // authenticate: passport.authenticate('local'),
  requireJwt: passport.authenticate('jwt'),
  signJwtForUser,
  login: passport.authenticate('local'),
  logout,
  isAdmin,
  isRegisteredUser,
  register
}