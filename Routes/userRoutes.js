const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router
  .route('/updateMe')
  // .patch(authController.protect, userController.updateMe);
  .patch(userController.updateMe);

router
  .route('/deleteMe')
  // .delete(authController.protect, userController.deleteMe);
  .delete(userController.deleteMe);

router
  .route('/updatepassword')
  // .patch(authController.protect, authController.updatePassword);
  .patch(authController.updatePassword);

router
  .route('/me')
  // .get(authController.protect, userController.getMe, userController.getUser);
  .get(userController.getMe, userController.getUser);

// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
