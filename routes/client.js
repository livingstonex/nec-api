const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/client');
const PasswordResetRateLimiter = require('../utils/ratelimit.utils');

//== Load Routes ==//
router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router.route('/logout').get(AuthController.logout);
router
  .route('/resetpassword')
  .post(PasswordResetRateLimiter, AuthController.requestPasswordReset);

router
  .route('/reset/:token')
  .post(PasswordResetRateLimiter, AuthController.resetPasswordByLink);

module.exports = router;
