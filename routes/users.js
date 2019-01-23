const express = require ('express');
const router = express.Router();
const User = require('../models/user');

// GET /users (R)
router.get('/user', (req, res, next) => {
  //this will return all the data
  User.find({})
    .then(data => res.json(data))
    .catch(next)
});

// router.use(requireJwt)

// POST /users (C)
router.post('/users', (req, res, next) => {
  if(req.body){
    User.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "You need to write something here." // input field is empty
    })
  }
});

// DELETE /users/:id (D)
router.delete('/users/:id', (req, res, next) => {
  User.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;