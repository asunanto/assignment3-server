const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require CategorySchema

const ProgramSchema = new Schema({
    name: String,
    description: String,
    // user_id: String,
    // categories: CategorySchema,
    createdAt: Date,
    // activity_id: String,
    length: Number // We want users to be able to select how many minutes the program will run for in five minute increments. We can do this by writing a loop.
});

// create model for activity
const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;