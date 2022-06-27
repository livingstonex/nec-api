const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  DomesticMarketsController,
  DomesticOrdersController,
} = require('../controllers/client');

// Domestic market (privileges middleware required)
router.route('/products').get(protect, DomesticMarketsController.index);
router.route('/product/:id').get(protect, DomesticMarketsController.get);

router
  .route('/orders')
  .get(protect, DomesticOrdersController.index)
  .post(protect, DomesticOrdersController.create);
  router.route('/order/:id').get(protect, DomesticOrdersController.get);
module.exports = router; 