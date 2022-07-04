const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/admin/AdminController');
const { StatusController } = require('../controllers/admin/product');
const DomesticMarket = require('../controllers/admin/domestic_market/DomesticMarketController');

router
  .route('/register')
  .post(protect, authorize(['super_admin']), AdminController.register);

router.route('/login').post(AdminController.login);

router.route('/logout').get(AdminController.logout);

router
  .route('/product/:id/status')
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    StatusController.update
  );

router
  .route('/domestic/market')
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.create
  )
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.index
  );
  
router
  .route('/domestic/market/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1']),
    DomesticMarket.delete
  );

module.exports = router;
