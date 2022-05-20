const rateLimit = require('express-rate-limiter');
const Env = require('./env.utils');

const PasswordResetRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins window
  max: Env.live ? 3 : 50, // start blocking after 3 requests in prod
  message: 'Too many requests, please try again after 10 mins',
});

module.exports = PasswordResetRateLimiter;
