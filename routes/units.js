const express = require ('express');
const router = express.Router();
const Unit = require('../models/unit');

// GET /units (R)
router.get('/', (req, res, next) => {
  //this will return all the data
  Unit.find({})
    .then(data => res.json(data))
    .catch(next)
});

// Only allow registered users to post and delete units
// router.use(requireJwt)

// POST /units (C)
router.post('/', (req, res, next) => {
  if(req.body){
    Unit.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({
      error: "You need to write something here." // input field is empty
    })
  }
});

// router.post('/:id/addUser/', requireJwt, async (req, res) => {
  
//   const addUserToUnit = await Unit.findByIdAndUpdate(
//     req.params.id, 
//     {$addToSet: {users: req.user}}, // addToSet adds an element to a field
//     {new: true} // setting to return the updated property
//     )
//   if (!addUserToUnit) res.status(404).json({
//     error: "Unit Id not found"
//   })
//   res.json(addUserToUnit)
// })


// DELETE /units/:id (D)
router.delete('/:id', (req, res, next) => {
  Unit.findOneAndDelete({"_id": req.params.id})
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router;
