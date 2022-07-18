const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { ProductController } = require('../controllers');

// modify protect to recognise admins or create another function to handle admins.
router
  .route('/')
  .post(protect, authorize(['super_admin', 'admin1', 'admin2', 'admin3']), ProductController.create)
  .get(ProductController.index);

router
  .route('/:id')
  .get(ProductController.get)
  .put(protect, authorize(['super_admin', 'admin1', 'admin2', 'admin3']), ProductController.update);

router.route('/user/all').get(protect, ProductController.getUserProducts);

module.exports = router;
