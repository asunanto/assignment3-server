const express = require ('express');
const router = express.Router();
const Activity = require('../models/activity');

// GET /activities (R)
router.get('/activity', (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Activity.find({}, 'action')
    .then(data => res.json(data))
    .catch(next)
});

// Only allow registered users to post and delete activities
// router.use(requireJwt)

// POST /activities (C)
router.post('/activities', (req, res, next) => {
  if(req.body.action){
    Activity.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "The input field is empty"
    })
  }
});

// DELETE /activities/:id (D)
router.delete('/activities/:id', (req, res, next) => {
  Activity.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;