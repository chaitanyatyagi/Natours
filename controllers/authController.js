const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('util');

// const signToken = (id) => {
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

exports.signup = catchAsync(async (req, res, next) => {
  //   const newUser = await User.create(req.body);
  // we have written above code into this format coz we only allow the data that we want to be put into the newUser, this way if user want to apply for the role like user admin, so we won't allow him to do so
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // 3rd parameter consists of options --> there we will place something which will make our jwt invalid which means user has logged out after certain point of time as a matter of security !!
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //   const token = signToken(newUser._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // since variable name == body.{name} ----> therefore according to ES6 Feature ---> [{email} = req.body]  ===  [email = req.body.email]
  const { email, password } = req.body;
  //1) Check if email & password is exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) Check if user exists && password is correct
  // .select('+password') ---> it means that we have added password in our response, and since its not their in the data base therefore we habe to do this in this way
  const user = await User.findOne({ email }).select('+password');
  // To check --> 'pass12345' === 'abdjmn3k54nkfj&bjdcn^hbhbdkjkf3&jhjghg7JHJj2h3jh3'

  // we have put this in if statement coz if user is not valid then it wont read user.password therefore we have directly put in the if statement
  //   const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  // 3) If everything is ok, send token to client
  //   const token = signToken(user._id);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token,
  });
});

// this middleware is made to give loggedin users the access to see all our data in database
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  // 2) Verification of token

  // this line refer to video 132
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed passowrd after the token was issue
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed Password', 401));
  }
  // Grant Access to protected route
  req.user = freshUser;
  next();
});

// Authorization one middleware !!

// here we want to get arguments that we have defined in our tour route, but we know that middleware function does'n take argumnets, therefore we have put it inside another function where we are assigning all are arguments in the form of array

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin','lead-guide']
    // here req.user is from previous middleware i.e. is protect , in our routes once it will go into protect middleware where we will get req.user = currently logged in user, then from this variable we can get our role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Password Reset
// Step 1
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  // 2) Generate the random reset token
  const restToken = user.createPasswordResetToken();

  // uptill now we had just modified the data but hasn't saved it,now by doing so we are saving it + we had done all validations false
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
});
//Step 2
// exports.resetPassword = (req, res, next) => {};
