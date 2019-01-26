const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    title: String,
    description: String,
    user: {
        type: new Schema({
          name: {
            firstname: String,
            lastname: String,
            guidename: String
          }
        })
      },
    ageLevel: {
        type: new Schema({
          name: String
        })
      },
    createdAt: { type: Date, default: Date.now },
    category: String,
    length: Number // Is this the appropriate value? We want users to be able to select how many minutes the activity will take to run.
});

// create model for activity
const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;