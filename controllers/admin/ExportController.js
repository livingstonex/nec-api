const { Op } = require('sequelize');
const { Order } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    try {
      const exportCount = await Order.count({
        where: {
          seller_id: {
            [Op.ne]: null,
          },
        },
      });

      return res.ok({
        message: 'Success',
        data: exportCount,
      });
    } catch (e) {
      next(e);
    }
  },
  async get(req, res, next) {
    const { id } = req.params;
    try {
      const item = await Order.findOne({
        where: {
          id,
        },
      });
      if (!item) {
        return res.notFound({
          message: 'We could not find the item',
        });
      }

      return res.ok({
        message: 'success',
        data: item,
      });
    } catch (e) {
      return next(e);
    }
  },
  async pendingOrders(req, res, next) {
    try {
      const pending = await Order.count({
        where: {
          status: 'PENDING',
        },
      });

      res.ok({
        message: 'success',
        data: pending,
      });
    } catch (e) {
      next(e);
    }
  },
  async fulfilledOrders(req, res, next) {
    try {
      const filled = await Order.count({
        where: {
          status: 'COMPLETED',
        },
      });

      return res.ok({
        message: 'Success',
        data: filled,
      });
    } catch (e) {
      next(e);
    }
  },
  async ordersInProgress(req, res, next) {
    try {
      const in_progress = await Order.count({
        where: {
          status: [
            'MATCHING',
            'MATCHING_COMPLETED',
            'ENROUTE',
            'ARRIVED',
            'DELIVERED',
          ],
        },
      });

      return res.ok({
        message: 'success',
        data: in_progress,
      });
    } catch (e) {
      return next(e);
    }
  },
};
