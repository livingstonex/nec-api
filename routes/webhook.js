const express = require('express');
const router = express.Router();
const payStackWebHook = require('../controllers/webhook/paystackController');

router.route('/webhook').post(payStackWebHook);
module.exports = router;