const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/client');
const PasswordResetRateLimiter = require('../utils/ratelimit.utils');

/**
 * @openapi
 * '/api/client/register':
 *  post:
 *    tags:
 *      - User
 *    summary: Register a User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/CreateUserInput"
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CreateUserResponse'
 *        400:
 *          description: Bad request
 */
router.route('/register').post(AuthController.register);

/**
 * @swagger
 * /api/client/verifyemail/{verificationcode}:
 *  post:
 *    description: Verify user's email
 *    responses:
 *      '200':
 *        description: Login successful
 *      '400':
 *        description: Bad request.
 *
 */
router.route('/verifyemail/:verificationcode').get(AuthController.verifyEmail);

/**
 * @swagger
 * /api/client/login:
 *  post:
 *    description: Login a user
 *    responses:
 *      '200':
 *        description: Email verified successfully
 *      '400':
 *        description: Bad request
 *      '422':
 *        description: Your verification token is either invalid or expired.
 *
 */
router.route('/login').post(AuthController.login);

/**
 * @swagger
 * /api/client/logout:
 *  get:
 *    description: Used to logout a user
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.route('/logout').get(AuthController.logout);

/**
 * @swagger
 * /api/client/resetpassword:
 *  post:
 *    description: Reset a user's password
 *    responses:
 *      '201':
 *        description: Password reset link sent! Please check your email inbox for a reset link
 *      '400':
 *        description: Please provide an email address.
 *      '404':
 *        description: User with the email not found.
 */
router
  .route('/resetpassword')
  .post(PasswordResetRateLimiter, AuthController.requestPasswordReset);

/**
 * @swagger
 * /api/client/reset/{token}:
 *  post:
 *    description: Reset a user's password via link
 *    responses:
 *      '200':
 *        description: Password reset successful.
 *      '422':
 *        description: No account is attached to this token || Your reset token is either invalid or expired
 *      '400':
 *        description: Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters, at least a number and a special character.
 *
 */
router
  .route('/reset/:token')
  .post(PasswordResetRateLimiter, AuthController.resetPasswordByLink);

module.exports = router;
