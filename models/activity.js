const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: String,
    description: String,
    user_id: String,
    ageLevel: String,
    categories: String,
    timeStamp: String,
    length: Time, // Is this the appropriate value? We want users to be able to select how many minutes the activity will take to run.
});

// create model for activity
const Activity = mongoose.model('activity', ActivitySchema);

module.exports = Activity;
