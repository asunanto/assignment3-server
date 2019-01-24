const express = require ('express');
const router = express.Router();
const Activity = require('../models/activity');
const {requireJwt} = require('../middleware/auth')

// GET /activities (R)
router.get('/', (req, res, next) => {
  //this will return all the data, exposing only the id and important fields to the client
  Activity.find({})
    .then(data => res.json(data))
    .catch(next)
});

// Only allow registered users to post and delete activities
// router.use(requireJwt)

// POST /activities (C)
router.post('/', requireJwt, (req, res, next) => {
  if(req.body){

    Activity.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user,
      ageLevel: req.body.ageLevel,
      createdAt: req.body.createdAt,
      length: req.body.length, // 
    })
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "You need to write something here." // input field is empty
    })
  }
});





// DELETE /activities/:id (D)
router.delete('/:id', (req, res, next) => {
  Activity.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;