const express = require('express');
const router = express.Router();
const  AuthController = require('../controllers/client/AuthController');

//== Load Routes ==//
router.route('/register').post(AuthController.register);

module.exports = router;
