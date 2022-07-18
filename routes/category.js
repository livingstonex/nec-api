const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { CategoryController } = require('../controllers');

// modify protect to recognise admins or create another function to handle admins.
router
  .route('/')
  .post(protect, authorize(['super_admin', 'admin1', 'admin2', 'admin3']), CategoryController.create)
  .get(CategoryController.index);

router
  .route('/:id')
  .get(CategoryController.get)
  .put(protect, authorize(['super_admin', 'admin1', 'admin2', 'admin3']), CategoryController.update);

module.exports = router;
