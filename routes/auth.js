const express = require('express');
const router = express.Router();

const {
  register,
  // authenticate,
  signJwtForUser,
  login,
  logout
} = require('../middleware/auth')

// Register user
router.post('/register', register, signJwtForUser)

// Authenticate and log in user
router.post('/login', login, signJwtForUser)

// Log out user
router.get('/logout', logout)

module.exports = router;