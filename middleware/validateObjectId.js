const mongoose = require('mongoose')
module.exports = function(req,res,next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json({error: "not a valid id"})
  
  next()
}