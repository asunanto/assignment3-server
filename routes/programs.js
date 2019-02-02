const express = require('express');
const router = express.Router();
const Program = require('../models/program');
const { requireJwt } = require('../middleware/auth')
const Activity = require('../models/activity')

// GET /programs (R)
router.get('/', (req, res) => {
  //this will return all the data, exposing only the id and action field to the client
  Program.find()
    .then(programs => res.json(programs))
    .catch(
      error => res.status(500).json({
        error: error.message
      })
    )
});

router.get('/:id', async (req, res) => {
  //this will return one data, exposing only the id and important fields to the client
  try {
    let program = await Program.findById(req.params.id)
    if (!program) res.status(404).json({ error: "Error Program ID not found" })
    let activities = []
    for (activity of program.activities) {
      activities.push(await Activity.findById(activity))
    }
    res.json({ program, activities })
  }
  catch (error) { res.json({ error }) }

});



// Only allow registered users to post and delete programs
// router.use(requireJwt)

// POST /programs (C)
router.post('/', requireJwt, async (req, res, next) => {
  req.body.unit = req.user.unit
  req.body.user = req.user
  try {
    const program = await Program.create(req.body)
    if (!program) res.status(404).json({
      error: "error occured while creating program"
    })

    // const unit = await Unit.findByIdAndUpdate(req.user.unit,{
    //   $addToSet: {programs: program}, 
    // }, { new: true })
    // if (!unit) res.status(404).json({error: "can't find unit id"})

    // const user = await User.findByIdAndUpdate(req.user, {
    //   $addToSet: {programs: program}
    // }, { new: true })
    // if (!user) res.status(404).json({error: "can't find user id"})

    res.json(program)
  }
  catch (error) { res.json({ error }) }

});

router.put('/:id/addActivities', requireJwt, async (req, res, next) => {
  //:id is the id for program
  const addActivitiesToProgram = await Program.findByIdAndUpdate(req.params.id, {
    $set: { activities: req.body }
  }, { new: true }) // returns updated program
  if (!addActivitiesToProgram) res.status(404).json({
    error: "Programs Id not found"
  })
  res.json(addActivitiesToProgram)
})

// DELETE /programs/:id (D)
router.delete('/:id', async (req, res, next) => {
  const result = await programAuth(req.params.id, req.user)
  if (!result) return res.status(401).json({error: "not authorized to edit"})
  Program.findOneAndDelete({ "_id": req.params.id })
    .then(data => res.json(data))
    .catch(next)
})

// Update /programs/:id only updates the program details
router.put('/:id', requireJwt, async (req, res) => {
  const result = await programAuth(req.params.id, req.user)
  if (!result) return res.status(401).json({error: "not authorized to edit"})
  const program = await Program.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, { new: true })
  if (!program) res.status(404).json({ error: "program id not found" })
  res.json(program)
});

async function programAuth(id, user) {
  const program = await Program.findById(id)
  // have to use .equals to compare object ids
  return program.user._id.equals(user._id) || user.role == 'admin'
}

module.exports = router;