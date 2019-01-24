const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require AgeLevelSchema

const UnitSchema = new Schema({
    name: String,
    guidehut: String, // How does this work? Do we have a GuideHut table?
    user_id: String
    // ageLevel: AgeLevelSchema,
});

// const unitSchema = new Schema({
//   name: String,
//   guideHutName: String,
//   guideHutAddress: String,
//   users: [{
//     type: new Schema({
//       email: String
//     })
//   }]
//   // ageLevel: ageLevelschema
// });


// create model for activity
const Unit = mongoose.model('Unit', UnitSchema);

module.exports = Unit;
