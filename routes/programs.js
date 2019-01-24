const express = require ('express');
const router = express.Router();
const Program = require('../models/program');
const {requireJwt} = require('../middleware/auth')

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



// Only allow registered users to post and delete programs
// router.use(requireJwt)

// POST /programs (C)
router.post('/', requireJwt,(req, res, next) => {
  if(req.body){
    Program.create({
      name: req.body.title,
      description: req.body.description,
      user: req.user,
      unit: req.user.unit,
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

router.put('/:id/addActivities', requireJwt, async(req,res,next) => {
    const addActivitiesToProgram = await Program.findByIdAndUpdate(
    req.params.id, 
    {$set: {activities: req.body.activities}}, // addToSet adds an element to a field
    {new: true} // setting to return the updated property
    )
  if (!addActivitiesToProgram) res.status(404).json({
    error: "Unit Id not found"
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