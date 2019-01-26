const express = require ('express');
const router = express.Router();
const Program = require('../models/program');
const {requireJwt} = require('../middleware/auth')
const Unit = require('../models/unit')

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

router.get('/:id', async(req, res) => {
  //this will return one data, exposing only the id and important fields to the client
  try {
    const program = await Program.findById(req.params.id)
    if (!program) res.status(404).json({error: "Error Program ID not found"})
    res.json(program)
  }
  catch(error) { res.json({error}) }
  
});



// Only allow registered users to post and delete programs
// router.use(requireJwt)

// POST /programs (C)
router.post('/', requireJwt, async(req, res, next) => {
    req.body.unit = req.user.unit
    req.body.user = req.user
    const program = await Program.create(req.body)
    if (!program) res.status(404).json({
      error: "error occured while creating program"
    })
    const unit = await Unit.findByIdAndUpdate(req.user.unit,{
      $addToSet: {programs: program}
    })
    if (!unit) res.status(404).json({
      error: "can't find unit id"
    })
    
    res.json(program)
  
});

router.put('/:id/addActivities', requireJwt, async(req,res,next) => {
  //:id is the id for program
    const addActivitiesToProgram = await Program.findByIdAndUpdate(req.params.id, {
      $set: {activities: req.body.activities}
    }, {new: true}) // returns updated program
  if (!addActivitiesToProgram) res.status(404).json({
    error: "Programs Id not found"
  })
  res.json(addActivitiesToProgram)
})

// DELETE /programs/:id (D)
router.delete('/:id', (req, res, next) => {
  Program.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;