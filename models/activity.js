const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require AgeLevelSchema & CategorySchema

const ActivitySchema = new Schema({
    title: String,
    description: String,
    user_id: String,
    ageLevel: AgeLevelSchema,
    categories: CategorySchema,
    createdAt: Date,
    length: Integer, // Is this the appropriate value? We want users to be able to select how many minutes the activity will take to run.
});

// create model for activity
const Activity = mongoose.model('activity', ActivitySchema);

module.exports = Activity;