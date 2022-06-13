// const fs = require('fs');
const Tour = require('../models/tourModels');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// using this now we have to check only once whether id is correct or not and we are not supposed to check it again and again ---- see how we have used it in param middleware in tourRoutes file inside routes folder
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: 'Bad Request',
//       message: 'Missing name',
//     });
//   }
//   if (!req.body.price) {
//     return res.status(400).json({
//       status: 'Bad Request',
//       message: 'Missing price',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryObj = { ...this.queryString };
//     const excludeFields = ['page', 'sort', 'limit', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   sorting() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt');
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }

//   paginate() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.requestTime);

  // try {
  // BUILD QUERY
  // 1)A FILTERING
  // how to get rid of those queries that we don't want to implement
  // const queryObj = { ...req.query };
  // const excludeFields = ['page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);

  // EXECUTE QUERY FOR FILTERING (SIMPLE)
  // const query = Tour.find({
  //   queryObj,
  // });

  // const tours = await Tour.find();

  // now on putting query in our url like ?duration=5&limit=10&sort=1&difficulty=easy    ----->  then our queryObj will consists of {duration:5,difficulty:easy}

  // 2)B ADVANCE FILTERING

  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // EXECUTE QUERY FOR ADVANCE FILTERING
  // const query = Tour.find(JSON.parse(queryStr));

  // let query = Tour.find(JSON.parse(queryStr));

  // 2) SORTING
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  // 3) LIMITTING FIELDS
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   // include everything except __v
  //   query = query.select('-__v');
  // }

  // 4) PAGINATION

  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // // page=2&limit=10   ----> to get on page 2 this means we want 11-20 docs ...... 1-10(pg1) 11-10(pg2) ..... so inorder to get pg2 we need to skip 10 ...... therefore skip(10) is used
  // query = query.skip(skip).limit(limit);

  // now in our code 9 docs are there , what if we select page 4 limit 3 -----> it will give us nothing ..... to fix it --
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) {
  //     throw new Error('This page does not exist');
  //   }
  // }

  // EXECUTE QUERY

  // const query = Tour.find({
  //   queryObj,
  // });

  // const tours = await Tour.find()
  //   .where('duration')
  // .equals(5) // you can use lte(less than equal) or lt(lessthan) or gt or gte
  // .where('difficulty')
  // .equals('easy');

  // we did so (await thing) coz ---> if we do like const tours = await Tour.find(--//--) then other query needs to wait untill we are done with this one..... now we will first implement all queries then apply await so that , that particular operation will be occuring and none of the queries need to wait !!
  // const tours = await query;

  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestedat: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid !!',
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // try {
  const tour = await Tour.findById(req.params.id);
  // Tour.findById(re.params.id) == Tour.findOne({_id:req.params.id})

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid !!',
  //   });
  // }
});

exports.createTour = catchAsync(async (req, res, next) => {
  // try {
  // one way to store data in database
  // const newTour = new Tour({})
  // newTour.save()

  // second way to store data in database
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
  // const newID = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newID }, req.body);

  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tours: newTour,
  //       },
  //     });
  //   }
  // );
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'Fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid !!',
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'Fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid !!',
  //   });
  // }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // it will give data from all the selected documents, since we have set id = null so no secific document is selected therefore entire documents are selected
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 }, // number of tours
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' }, // gives average rating
        avgPrice: { $avg: '$price' }, // gives average price
        minPrice: { $min: '$price' }, // gives minimum price
        maxPrice: { $max: '$price' }, // gives maximum price
      },
    },
    // you can only sort those properties that are present in group since only these quantities are only present in our api
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // we can reuse these stages, this time we have set those data to show which is != (ne) to 'EASY'
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'Fail',
  //     message: error,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    // it will unwind startDates array, now we have one document three times each with different start dates i.e. startDates[0],startDates[1],startDates[2]
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // now we will get in 2021 in each months how many tours are there
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        // this will lead to the creation of array consisting of names of tours in that particular month
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    // this will not show id, if id is set to 1 then it will show
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        numTourStarts: 1,
      },
    },
    // it will lead to display only 6 documents
    // {
    //   $limit: 6,
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: 'Fail',
  //     message: error,
  //   });
  // }
});
