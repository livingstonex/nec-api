const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/client');
const PasswordResetRateLimiter = require('../utils/ratelimit.utils');

//== Load Routes ==//
router.route('/register').post(AuthController.register);
router.route(
  '/resetpassword',
  PasswordResetRateLimiter,
  AuthController.requestPasswordReset
);
router.post(
  '/reset/:token',
  PasswordResetRateLimiter,
  AuthController.resetPasswordByLink
);

module.exports = router;
