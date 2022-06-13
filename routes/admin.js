const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/admin/AdminController');

/**
 * @swagger
 * /api/admin/register:
 *  post:
 *    description: Register Admin
 *    responses:
 *      '201':
 *        description: Admin created successfully
 *      '400':
 *        description: Bad request
 *      '422':
 *        Admin already exists
 *
 */
router.route('/register').post(AdminController.register);
/**
 * @swagger
 * /api/admin/login:
 *  post:
 *    description: Login Admin
 *    responses:
 *      '200':
 *        description: Admin login successful
 *      '400':
 *        description: Bad request
 *
 */
router.route('/login').post(AdminController.login);
/**
 * @swagger
 * /api/admin/logout:
 *  get:
 *    description: Login Admin
 *    responses:
 *      '200':
 *        description: Admin logout successful
 *
 */
router.route('/logout').get(AdminController.logout);

module.exports = router;