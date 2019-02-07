const express = require ('express');
const router = express.Router();
const Activity = require('../models/activity');
const Unit = require('../models/unit')
const User = require('../models/user');
const {requireJwt} = require('../middleware/auth')
const validateObjectId = require('../middleware/validateObjectId')


// GET /activities (R)
router.get('/', (req, res, next) => {
  //this will return all the data, exposing only the id and important fields to the client
  Activity.find({})
    .then(data => res.json(data))
    .catch(next)
});

router.get('/:id', validateObjectId, async(req, res) => {
  //this will return one data, exposing only the id and important fields to the client
  
  const activity = await Activity.findById(req.params.id)
  if (!activity) return res.status(404).json({error: "Cant find activity id"})
  res.json(activity)
});

// Only allow registered users to post and delete activities
// router.use(requireJwt)

// POST /activities (C)
router.post('/', requireJwt, async(req, res) => {
  req.body.user = req.user
  const activity = await Activity.create(req.body)
  // const user = await User.findByIdAndUpdate(req.user, {
  //   $addToSet: { activities: activity }
  // }, { new: true })
  if (!activity) return res.status(404).json({error: "user id not found"})
  res.json(activity)
});
// Update /activities/:id
router.put('/:id', requireJwt, async(req, res) => {
  const result = await activityAuth(req.params.id, req.user)
  // if result of auth is negative throw 401 error
  if (!result) return res.status(401).json({error: "not authorized to edit"})
  const activity = await Activity.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, { new: true })
  if (!activity) return res.status(404).json({error: "user id not found"})
  res.json(activity)
});


// DELETE /activities/:id (D)
router.delete('/:id', requireJwt, async (req, res, next) => {
  const result = await activityAuth(req.params.id, req.user)
  // if result of auth is negative throw 401 error
  if (!result) return res.status(401).json({error: "not authorized to edit"})
  Activity.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

async function activityAuth(id, user) {
  const activity = await Activity.findById(id)
  // have to use .equals to compare object ids
  return activity.user._id.equals(user._id) || user.role == 'admin'
}

module.exports = router;