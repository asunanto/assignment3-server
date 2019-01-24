const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ageLevelSchema =  new Schema({
    ageLevelname: String
})

const AgeLevel = mongoose.model('AgeLevel',ageLevelSchema);
module.exports = AgeLevel