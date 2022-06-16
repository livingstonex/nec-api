const router = require('express').Router();
const client = require('./client');
const plan = require('./plan');
const webhook = require('./webhook');
const responses = require('../middlewares/response');

router.use(responses);
router.use('/client', client);
router.use('/plan', plan);
router.use('/pay', webhook)

module.exports = router;
