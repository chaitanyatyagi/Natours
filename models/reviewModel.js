const mongoose = require('mongoose');
const Tour = require('./tourModels');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user!'],
    },
  },
  {
    // this will show those details which are not in our database but still we want it to be displayed in our response!
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// populating reviews
reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  // statics method refer to current model , therefore this refer to current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQunatity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQunatity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: 1 });

// we want  these stats to be updated in our model , therefore we are applying this safe hook middleware
reviewSchema.post('save', function () {
  // this points to cuurent review that needs to be safed after which our above function will work nd calculate avg rating
  // Review.calculateAverageRatings(this.tour);
  // problem is in above code Review has not declared yet, and we can't put it after declaring Review coz doing so, we are actually declaring our model nd now any chng in it won't effet the model since it already has been declared using our reviewSchema, nd anything updated in our schema after declaring model is not going to be effect our model as in exppress the flow works sequencially

  // this refer to current doc and constructor refer to model which created this doc, therefore, this refer to current tour
  this.constructor.calculateAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
