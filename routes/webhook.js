const express = require('express');
const router = express.Router();
const payStackWebHook = require('../controllers/webHook/paystackController');

router.route('/webhook').post(payStackWebHook);
module.exports = router;