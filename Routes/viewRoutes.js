const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.route('/').get(viewController.getOverview);

router.route('/tour/:slug').get(viewController.getTour);

router.route('/login').get(viewController.getLoginForm);

module.exports = router;
