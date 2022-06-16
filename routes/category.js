const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { CategoryController } = require('../controllers');

// modify protect to recognise admins or create another function to handle admins.
router
  .route('/')
  .post(protect, CategoryController.create)
  .get(CategoryController.index);

router
  .route('/:id')
  .get(CategoryController.get)
  .put(protect, CategoryController.update);

module.exports = router;
