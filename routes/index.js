const router = require('express').Router();
const client = require('./client');
const plan = require('./plan');
const responses = require('../middlewares/response');
const requests = require('../middlewares/request');
const category = require('./category');
const product = require('./product');

router.use(responses);
router.use(requests);
router.use('/client', client);
router.use('/plan', plan);
router.use('/category', category);
router.use('/product', product);

module.exports = router;
