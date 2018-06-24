const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  avatar: String,
  email: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);