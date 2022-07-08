const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReview = factory.getAll(Review);
// exports.getAllReview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) {
//     filter = { tour: req.params.tourId };
//   }
//   console.log(filter);
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes !!
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    // since protect function is used before calling this controller therefore from there we will access our req.user
    req.body.user = req.user.id;
  }
  next();
};

exports.createReview = factory.createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   // Allow nested routes !!
//   if (!req.body.tour) {
//     req.body.tour = req.params.tourId;
//   }
//   if (!req.body.user) {
//     // since protect function is used before calling this controller therefore from there we will access our req.user
//     req.body.user = req.user.id;
//   }

//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
