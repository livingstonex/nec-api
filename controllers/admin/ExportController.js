const { Op } = require('sequelize');
const { Order } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    try {
      const exportCount = await Order.count();

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
    if (!id) {
      return res.badRequest({
        message: 'please pass in an ID',
      });
    }
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
  async pending(req, res, next) {
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
  async fulfilled(req, res, next) {
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
  async inProgress(req, res, next) {
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
