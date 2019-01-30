const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require CategorySchema

const ProgramSchema = new Schema({
    name: String,
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
    unit: {
        type: new Schema({
          name: String
        })
      },
    createdAt: { type: Date, default: Date.now },
    activities: [{
        type: new Schema({
          // title: String,
          // description: String,
          // category: String,
          // length: String
        })
      }],
    length: Number // We want users to be able to select how many minutes the program will run for in five minute increments. We can do this by writing a loop.
});

// create model for activity
const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;