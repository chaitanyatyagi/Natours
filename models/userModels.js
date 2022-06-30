const crypto = require('crypto');
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
    // this will not show password in the output/response
    select: false,
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
  role: {
    type: String,
    enum: ['user', 'guide', 'leadguide', 'admin'],
    message: "This role doesn't exists !!",
    default: 'admin',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  // this refer to current document, isModifed refers to whether the data has been changed/modified or not, data is referred by key that we put inside isModified as argument this.isModified--->('password')<---
  if (!this.isModified('password')) return next();

  // encrypting our password
  this.password = await bcrypt.hash(this.password, 12);
  // undefing our confirm password so that it won't be visible in our database
  this.passwordConfirm = undefined;
  next();
});

// code to check if password is correct or not
// note -> its an instance method therefore its available on all the user documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// another instance for password change
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
};

// another instance method(method which involves entire document we do it with the help of mongoose) for password reset
// it requires crypto module for generating simple token, crypto --> built in module no need to install
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // now this resetToken needs to be encrypted coz if hacker gets the access to this token (from database as we are going to save it in our database ) then he will be able to reset your password
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // reset time
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // we need to return this plain (non-encrypted token) as we need it in our code since we need to send it in our email
  return resetToken;
};

// this middleware will tell us about the password changed at.
// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

// Query Middleware for deleting the current user response, this way we will deactivate its account
userSchema.pre(/^find/, function (next) {
  // this (/^find/) tells that it will work for all such queries where we use User.find...

  // this points to the current query

  // this.find({ active: true });
  // this way we will get only those users with active set as true

  this.find({ active: { $ne: false } });
  // we are using this coz for above method we are getting some issues due to which no user is visible
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
