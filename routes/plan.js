const express = require('express');
const router = express.Router();
const { PlanController } = require('../controllers');

router.route('/plan').post(PlanController.create);
router.route('/plan').get(PlanController.index);

module.exports = router;
