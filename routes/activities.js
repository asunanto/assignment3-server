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

router.get('/:id', async(req, res) => {
  //this will return one data, exposing only the id and important fields to the client
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) res.status(404).json({error: "Cant find activity id"})
    res.json(activity)
  }
  catch(error) { res.json({error}) }
  
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