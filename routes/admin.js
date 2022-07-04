const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/admin/AdminController');
const { StatusController } = require('../controllers/admin/product');
const DomesticMarket = require('../controllers/admin/domestic_market/DomesticMarketController');
const DomesticOrder = require('../controllers/admin/domestic_market/DomesticOrderController');

/**
 * @swagger
 * /api/admin/register:
 *  post:
 *    description: Register Admin
 *    responses:
 *      '201':
 *        description: Admin created successfully
 *      '400':
 *        description: Bad request
 *      '422':
 *        Admin already exists
 *
 */
router
  .route('/register')
  .post(protect, authorize(['super_admin']), AdminController.register);
// router.route('/register').post(protect, authorize(['super_admin']), AdminController.register);
/**
 * @swagger
 * /api/admin/login:
 *  post:
 *    description: Login Admin
 *    responses:
 *      '200':
 *        description: Admin login successful
 *      '400':
 *        description: Bad request
 *
 */
router.route('/login').post(AdminController.login);
/**
 * @swagger
 * /api/admin/logout:
 *  get:
 *    description: Login Admin
 *    responses:
 *      '200':
 *        description: Admin logout successful
 *
 */
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
  .get(
     
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
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticMarket.delete
  );
router.route('/domestic/market').post(
  protect,
  authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
  DomesticMarket.create
);
router
  .route('/domestic/orders')
  .get(
    protect,
    authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
    DomesticOrder.index
  );
  router
    .route('/domestic/orders/:id')
    .get(
      protect,
      authorize(['super_admin', 'admin1', 'admin2', 'admin3']),
      DomesticOrder.get
    )
    .put(DomesticOrder.update);
module.exports = router;
