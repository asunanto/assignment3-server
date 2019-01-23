const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require AgeLevelSchema

const UnitSchema = new Schema({
    name: String,
    guidehut_id: String, // How does this work? Do we have a GuideHut table?
    user_id: String,
    ageLevel: AgeLevelSchema,
});

// create model for activity
const Unit = mongoose.model('unit', UnitSchema);

module.exports = Unit;