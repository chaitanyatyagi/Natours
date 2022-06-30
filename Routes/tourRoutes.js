const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.getAllTours
  )
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  // AUTHORIZATION
  // 1st middleware -> only properly loggedin users with verification of tokens are allowed to reach database !!
  // 2nd middleware -> we are basically giving access to certain users , so that only they can delete certain tours not everyone !!
  // 3rd middleware -> deletion of tour !!
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
