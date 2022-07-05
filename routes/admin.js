const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/admin/AdminController');
const { StatusController } = require('../controllers/admin/product');
const DomesticMarketController = require('../controllers/admin/domestic_market/DomesticMarketController');
const DomesticOrderController = require('../controllers/admin/domestic_market/DomesticOrderController');
const DomesticProductController = require('../controllers/admin/domestic_market/DomesticProductController');
const DomesticTraderController = require('../controllers/admin/domestic_market/DomesticTraderController');

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

// Domestic Market
router
  .route('/domestic/market')
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarketController.create
  )
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarketController.index
  );

router
  .route('/domestic/market/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarketController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarketController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1']),
    DomesticMarketController.delete
  );

router
  .route('/domestic/market')
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarketController.create
  );

// Domestic Orders
router
  .route('/domestic/orders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticOrderController.index
  );

router
  .route('/domestic/orders/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticOrderController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticOrderController.update
  );

// Domestic Products
router
  .route('/domestic/products')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticProductController.index
  )
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticProductController.create
  );

router
  .route('/domestic/products/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticProductController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticProductController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticProductController.delete
  );

// Domestic Traders
router
  .route('/domestic/traders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticTraderController.index
  )
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticTraderController.create
  );

router
  .route('/domestic/traders/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticTraderController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticTraderController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticTraderController.delete
  );
  
module.exports = router;
