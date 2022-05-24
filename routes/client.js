const express = require('express');
const router = express.Router();
const  AuthController = require('../controllers/client/AuthController');

//== Load Routes ==//
router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router.route('/logout').get(AuthController.logout);

module.exports = router;
