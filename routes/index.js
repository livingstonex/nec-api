const router = require('express').Router();
const client = require('./client');

router.use('/client', client);

module.exports = router;
