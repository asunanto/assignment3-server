const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require AgeLevelSchema & CategorySchema

const ActivitySchema = new Schema({
    title: String,
    description: String,
    user: {
        type: new Schema({
          email: String
        })
      },
    ageLevel: {
        type: new Schema({
          name: String
        })
      },
    createdAt: Date,
    length: Number, // Is this the appropriate value? We want users to be able to select how many minutes the activity will take to run.
});

// create model for activity
const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;