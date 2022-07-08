const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(
  authController.protect,
  // authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan
);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  // AUTHORIZATION
  // 1st middleware -> only properly loggedin users with verification of tokens are allowed to reach database !!
  // 2nd middleware -> we are basically giving access to certain users , so that only they can delete certain tours not everyone !!
  // 3rd middleware -> deletion of tour !!
  .delete(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// POST /tour/tourId/review
// GET /tour/tourId/review
// GET /tour/tourId/review/userId

// router.route('/:tourId/reviews').post(
//   authController.protect,
//   // authController.restrictTo('user'),
//   reviewController.createReview
// );

// Alternative Solution

const reviewRouter = require('../Routes/reviewRoutes');
// similar to what we write in app.js for userRouter,tourRouter,reviewRouter
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
