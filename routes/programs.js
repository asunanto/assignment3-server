const express = require ('express');
const router = express.Router();
const Program = require('../models/program');

// GET /programs (R)
router.get('/program', (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Program.find({})
    .then(data => res.json(data))
    .catch(next)
});

// Only allow registered users to post and delete programs
// router.use(requireJwt)

// POST /programs (C)
router.post('/programs', (req, res, next) => {
  if(req.body){
    Program.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "You need to write something here." // input field is empty
    })
  }
});

// DELETE /programs/:id (D)
router.delete('/programs/:id', (req, res, next) => {
  Program.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;