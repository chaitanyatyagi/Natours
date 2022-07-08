// ---------------------------------------------Only For Express---------------------------------------------
// const express = require('express');

// basically express --> it's a function which assigns multiple methods to our "app" variable !!
// const app = express();

// app.get('/', (req,res) => {
//   //   res.send('Hello from the server side!');
//   res.status(200).send('Hello from the server side!');
// });

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this URL!');
// });

// to start the server
// const port = 5500;

// app.listen(port, '127.0.0.1', () => {
//   console.log(`App running on ${port}...`);
// });

// ------------------------------------------------------The End-------------------------------------------------------

// ------------------------------------------------------------For Our Project - Learning----------------------------------------------------

// const express = require('express');
// const fs = require('fs');
// const app = express();
// const morgan = require('morgan');
// const port = 5500;

// app.use(express.json());
// express.json() --> this is middleware

// ------------------------------------------------3rd party middleware----------------------------------------------
// app.use(morgan('dev'));

// ----------------------------------------------CREATING OUR OWN MIDDLEWARE------------------------------------------------------
// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// --------------------------------------------GET HTTP METHOD----------------------------------------------------
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: 'success',
//     requestedat: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };
// app.get('/api/v1/tours', getAllTours);
// ---------------------------------------------GET HTTP METHOD END-------------------------------------------------------

// ---------------------------------------------PARAMETER IN GET METHOD----------------------------------------------------
// : (colon) --> it leads to assign parameter, ? --> it leads to let the parameter be optional, even if we dont use it in our url then also response will be sends else error would have disappeared

// const getTour = (req, res) => {
//   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);

//   // if (id > tours.length) {
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// app.get('/api/v1/tours/:id', getTour);
//------------------------------------------------PARAMETER IN GET METHOD END-------------------------------------------------

// -------------------------------------------------POST HTTP METHOD---------------------------------------------------------

// body is a method that we use to get data from req and it is available due to the middleware that we used moments ago
// const createTour = (req, res) => {
//     console.log(req.body);
//   const newID = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newID }, req.body);

//   tours.push(newTour);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };
// app.post('/api/v1/tours', createTour);
// -------------------------------------------------POST HTTP METHOD END---------------------------------------------------------

// // -------------------------------------------------PATCH HTTP METHOD---------------------------------------------------------
// const updateTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '< Updated tour here ... >',
//     },
//   });
// };

// app.patch('/api/v1/tours/:id', updateTour);
// -------------------------------------------------PATCH HTTP METHOD END---------------------------------------------------------

// -------------------------------------------------DELETE HTTP METHOD---------------------------------------------------------
// const deleteTour = (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Fail',
//       message: 'Invalid ID',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

// app.delete('/api/v1/tours/:id', deleteTour);
// -------------------------------------------------DELETE HTTP METHOD END---------------------------------------------------------

// -----------------------------------------ALL METHODS TOGETHER-----------------------------------------------
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ---------------------------------------------------REFACTORING OUR ROUTES IN MUCH BETTER WAY------------------------------------
// app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// ------------------------------------------------------Creating and mounting routes---------------------------------------------------
// const tourRouter = express.Router();
// app.use('/api/v1/tours', tourRouter);

// tourRouter.route('/').get(getAllTours).post(createTour);

// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// ----------------------------------------------------Users Resources--------------------------------------------------
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet done!',
//   });
// };

// const createUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet done!',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet done!',
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet done!',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet done!',
//   });
// };

// app.route('/api/v1/users').get(getAllUsers).post(createUsers);

// app
//   .route('/api/v1/users/:id')
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// ------------------------------------------------------Creating and mounting routes---------------------------------------------------
// const userRouter = express.Router();

// app.use('/api/v1/users', userRouter);

// userRouter.route('/').get(getAllUsers).post(createUsers);

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// --------------------------------------------------Project-------------------------------------------

// 1) IMPORTS
const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const viewRouter = require('./Routes/viewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

// setting up our pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// how to access file from our computer/file system ----> built-in express middleware
app.use(express.static(path.join(__dirname, 'public')));
// 2) MIDDLEWARE
// use of enviornmental variables

// console.log(process.env.NODE_ENV);
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Development Logging
app.use(morgan('dev'));

// These middlewares are for securit !!
// Set HTTP header secure
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later in an hour!',
});
app.use('/api', limiter);

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

// how to handle faltu routes
// we have introduced middleware right here because since the req url is not responded by neither of our two routes so hence we have introduced an middleware which will handle this issue of unnecessary routes

// note all --> get + post + patch...    * ---> all types of routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server !`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server !`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server !`));
});

// global error handling middleware ----> use of above middleware to get err variable
app.use(globalErrorHandler);

module.exports = app;
