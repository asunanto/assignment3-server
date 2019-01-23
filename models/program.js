const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
    name: String,
    description: String,
    user_id: String,
    categories: String,
    timeStamp: String,
    activity_id: String,
    length: Time, // Is this the appropriate value? We want users to be able to select how many minutes the program will run for.
});

// create model for activity
const Program = mongoose.model('program', ProgramSchema);

module.exports = Program;