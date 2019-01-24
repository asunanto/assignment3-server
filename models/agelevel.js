const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ageLevelSchema =  new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

const AgeLevel = mongoose.model('AgeLevel',ageLevelSchema);
module.exports = AgeLevel