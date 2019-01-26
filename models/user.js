const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Passport-Local Mongoose will add a username, hash and salt field to store the
// username, the hashed password and the salt value. Additionally Passport-Local
// Mongoose adds some methods to your Schema.
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  name: {
    firstname: String,
    lastname: String,
    guidename: String
  },
  role: String,
  unit: {
    type: new Schema({
      name: String
    })
  },
  membershipNo: String,
  phone: String,
  
  activities: [{
    type: new Schema({
      title: String,
      description: String,
      length: Number
    })
  }],
  programs: [{
    type: new Schema({
      name: String,
      description: String,
      length: Number
    })
  }]
  
  // avatar: Image
});

// connect passportLocalMongoose and use 'email' instead of 'username'
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
