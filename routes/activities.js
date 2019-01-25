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
router.post('/', requireJwt, async(req, res) => {
  req.body.user = req.user
  const activity = await Activity.create(req.body)
  res.json(activity)
});

// DELETE /activities/:id (D)
router.delete('/:id', (req, res, next) => {
  Activity.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;