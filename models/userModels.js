const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name !'],
  },
  email: {
    type: String,
    required: [true, 'Please provide us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email address!'],
  },
  profile: String,
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // note here el = passwordConfirm while this refers to entire document
      // it will only works on CREATE & SAVE !!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same !',
    },
  },
});

userSchema.pre('save', async function (next) {
  // this refer to current document, isModifed refers to whether the data has been changed/modified or not, data is refereed by key that we put inside isModified as argument this.isModified--->('password')<---
  if (!this.isModified('password')) return next();

  // encrypting our password
  this.password = await bcrypt.hash(this.password, 12);
  // undefing our confirm password so that it won't be visible in our database
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
