const express = require('express');
const router = express.Router();
const {
  AuthController,
  PaymentController,
  CompanyController,
  OrderController,
} = require('../controllers/client');
const DomesticMarket = require('../controllers/client/domestic_market')
const PasswordResetRateLimiter = require('../utils/ratelimit.utils');
const { authorizePrivilege, protect } = require('../middlewares/auth');
const { verifyOtp } = require('../middlewares/otp')

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
router.route('/exporter/register').post(verifyOtp, AuthController.registerExporter);
router.route('/otp').post(AuthController.sendOtp);


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

/**
 * @swagger
 * /api/client/avatar:
 *  post:
 *    description: Upload profile picture and replace profile picture
 *    responses:
 *      '201':
 *        description: Profile picture uploaded successfully
 *      '400':
 *        description: No image sent with request
 *      '413':
 *        description: Image size is too large (max 2MB)
 *
 */
router.route('/avatar').post(protect, AuthController.uploadAvatar);
/**
 * @swagger
 * /api/client/avatar:
 *  delete:
 *    description: Delete profile picture
 *    responses:
 *      '200':
 *        description: Profile picture deleted successfully
 *
 */
router.route('/avatar').delete(protect, AuthController.removeAvatar);
/**
 * @swagger
 * /api/client/profile:
 *  put:
 *    description: Update profile and password
 *    responses:
 *      '200':
 *        description: Profile updated successfully.
 */
router.route('/profile').put(protect, authorizePrivilege([1,2,3,4,5]), AuthController.updateProfile);

/**
 * @swagger
 * /api/client/payments:
 *  get:
 *    description: Get all user payments
 *    responses:
 *      '200':
 *        description: Payments fetched successfully.
 */
router.route('/payments').get(protect, PaymentController.index);


router.route('/payments/:reference').get(protect, PaymentController.get);

router.route('/payments').post(protect, PaymentController.create);

router
  .route('/companies')
  .post(protect, CompanyController.create)
  .get(protect, CompanyController.index);

router
  .route('/companies/:id')
  .get(protect, CompanyController.get)
  .put(protect, CompanyController.update);

router
  .route('/orders')
  .get(protect, OrderController.index)
  .post(protect, OrderController.create);

router.route('/orders/:id').get(protect, OrderController.get);

// Needs to be checked if he's an exporter (apply privileges middleware)
router.route('/orders/by/seller').get(protect, OrderController.index_seller);

router
  .route('/domestic/orders')
  .get(protect, DomesticMarket.OrderController.index)
  .post(protect, DomesticMarket.OrderController.create);

router.route('/domestic/orders/:id').get(protect, DomesticMarket.OrderController.get);

// User should be logged in
router.route('/domestic/products').get(DomesticMarket.ProductController.index);
router.route('/domestic/products/:id').get(DomesticMarket.ProductController.get);

module.exports = router;
