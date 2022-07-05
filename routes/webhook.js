const express = require('express');
const router = express.Router();
const payStackWebHook = require('../controllers/webhook/PaystackController');

router.route('/webhook').post(payStackWebHook);
module.exports = router;
