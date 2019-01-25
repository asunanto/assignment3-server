const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {requireJwt} = require('../middleware/auth')
const Activity = require('../models/activity')
const Program = require('../models/program')

// GET /users (R)
router.get('/', requireJwt, async(req, res, next) => {
  const activities = await Activity.find({"user":req.user})
  if (!activities) res.status(404).json({
    error: "Cant find activity from user"
  })
  const programs = await Program.find({"user":req.user})
  if (!programs) res.status(404).json({
    error: "Cant find activity from user"
  })

  res.json({activities, programs})
  
});

// router.use(requireJwt)

// UPDATE 1 user activities
router.get('/activities', requireJwt, async(req,res) => {
  const activities = await Activity.find({"user":req.user})
  if (!activities) res.status(404).json({
    error: "Cant find activity from user"
  })
  res.json(activities)
})

// DELETE /users/:id (D)
router.delete('/:id', (req, res, next) => {
  User.findOneAndDelete({ "_id": req.params.id })
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;