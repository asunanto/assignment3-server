const express = require('express');
const router = express.Router();

const {
    isAdmin
} = require('../middleware/auth')

// Use the isAdmin middleware check for these routes
router.use('/', isAdmin)

// Just a test route for now - a get and post
router.get('/greeting', (req, res) => {
    res.send('Greetings program!')
})

router.post('/greeting', (req, res) => {
    res.send('Greetings program!')
})

module.exports = router