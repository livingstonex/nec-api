const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/admin/AdminController');
const Product = require('../controllers/admin/product');
const Orders = require('../controllers/admin/orders');
const DomesticMarket = require('../controllers/admin/domestic_market');
const {
  CompanyController,
  PartnerCompanyController,
} = require('../controllers/admin');
const { UsersController } = require('../controllers/admin/client');

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
    Product.StatusController.update
  );

// Orders
router
  .route('/orders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    Orders.OrderController.index
  );

router
  .route('/orders/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    Orders.OrderController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    Orders.OrderController.update
  );

router
  .route('/orders/:id/status')
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    Orders.StatusController.update
  );

// Domestic Market
router
  .route('/domestic/market')
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.MarketController.create
  )
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.MarketController.index
  );

router
  .route('/domestic/market/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.MarketController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.MarketController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1']),
    DomesticMarket.MarketController.delete
  );

// Domestic Orders
router
  .route('/domestic/orders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.OrderController.index
  );

router
  .route('/domestic/orders/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.OrderController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.OrderController.update
  );

// Domestic Products
router
  .route('/domestic/products')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.ProductController.index
  )
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.ProductController.create
  );

router
  .route('/domestic/products/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.ProductController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.ProductController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.ProductController.delete
  );

// Domestic Traders
router
  .route('/domestic/traders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.TraderController.index
  )
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.TraderController.create
  );

router
  .route('/domestic/traders/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.TraderController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.TraderController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.TraderController.delete
  );

// Company
router.route('/user/:id/company').get(protect, CompanyController.get);

// Partner Companies
router
  .route('/partner/companies')
  .get(PartnerCompanyController.index)
  .post(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    PartnerCompanyController.create
  );

router
  .route('/partner/companies/:id')
  .get(
    PartnerCompanyController.get
  )
  .put(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    PartnerCompanyController.update
  )
  .delete(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    PartnerCompanyController.delete
  );

//clients
router
  .route('/clients')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    UsersController.index
  );
router
  .route('/clients/:id')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    UsersController.get
  );

module.exports = router;
