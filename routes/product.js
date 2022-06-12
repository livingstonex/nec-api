const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { ProductController } = require('../controllers');

// modify protect to recognise admins or create another function to handle admins.
router
  .route('/')
  .post(protect, ProductController.create)
  .get(ProductController.index);

router
  .route('/:id')
  .get(ProductController.get)
  .put(protect, ProductController.update);

router.route('/user').get(protect, ProductController.getUserProducts);

module.exports = router;
