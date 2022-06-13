const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour length must be of max length 40'],
      minlength: [2, 'A tour length must be of min length 2'],
      // custom validator usage method 2
      //   validate: [validator.isAlpha, 'Tour must contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        error: 'error !! only 3',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0.1, 'Min = 1'],
      max: [5.0, 'Max = 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // custom validator
      validate: {
        validator: function (val) {
          // this only points to current document on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // it will remove all white spaces --->    "       hello        "  == "hello"   ----> with the help of trim
      required: [true, 'A tour must have discription'],
    },
    description: {
      type: String,
      trim: true, // it will remove all white spaces --->    "       hello        "  == "hello"   ----> with the help of trim
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // this way we are allowing are virtuals to be displayed
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Adding Virtual Properties to our API
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// THIS --> it points to current document object
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// this doc refers to ----> document just saved in the database
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// now once we create new tour and save it in our database we can see ---> console.log(this) written above and it will show our added document data

// QUERY MIDDLEWARE: it points to current query not current document
// THIS --> it points to current query object
tourSchema.pre(/^find/, function (next) {
  // this (/^find/) tells that it will work for all such queries where we use Tour.find...
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

// note: if in above function in quering this function if it doesn't matches then entire doc won't be displayed

// AGGREGATION MIDDLEWARE
// THIS --> it points to current aggregation object

tourSchema.pre('aggregate', function (next) {
  // how to add another thing in our aggregation pipeline? unshift adds anything in starting of the array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
});

// creating model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
