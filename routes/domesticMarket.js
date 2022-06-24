const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {DomesticProductController} = require('../controllers/client');


// Domestic market (privileges middleware required)
router
  .route('/products')
  .get(protect, DomesticProductController.index);
router
  .route('/product/:id')
  .get(protect, DomesticProductController.get);
module.exports = router;