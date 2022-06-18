const router = require('express').Router();
const admin = require('./admin');
const client = require('./client');
const plan = require('./plan');
const webhook = require('./webhook');
const responses = require('../middlewares/response');
const requests = require('../middlewares/request');
const category = require('./category');
const product = require('./product');

router.use(responses);
router.use(requests);
router.use('/admin', admin);
router.use('/client', client);
router.use('/plan', plan);
router.use('/pay', webhook);
router.use('/categories', category);
router.use('/products', product);

module.exports = router;
