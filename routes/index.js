const router = require('express').Router();
const client = require('./client');
const plan = require('./plan');

router.use('/client', client);
router.use('/plan', plan);

module.exports = router;
