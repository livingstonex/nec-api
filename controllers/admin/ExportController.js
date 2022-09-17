const { Op } = require('sequelize');
const { Order } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    try {
      const { count, rows } = await Order.findAndCountAll();

      if (!rows) {
        return res.notFound({
          message: 'No exports found',
        });
      }

      return res.ok({
        message: 'Success',
        data: count,
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
      const { count, rows } = Order.findAndCountAll({
        where: {
          status: 'PENDING',
        },
      });

      if (!rows) {
        return res.notFound({
          message: 'no pending orders found',
        });
      }

      res.ok({
        message: 'success',
        data: count,
      });
    } catch (e) {
      next(e);
    }
  },
  async fulfilled(req, res, next) {
    try {
      const { count, rows } = await Order.findAndCountAll({
        where: {
          status: 'COMPLETED',
        },
      });

      if (!rows) {
        return res.notFound({
          message: 'No exports found',
        });
      }

      return res.ok({
        message: 'Success',
        data: count,
      });
    } catch (e) {
      next(e);
    }
  },
  async inProgress(req, res, next) {
    try {
      const { count, rows } = await Order.findAndCountAll({
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
      if(!rows){
        return res.notFound({
          message:'No exports inprogress'
        })
      }
      return res.ok({
        message:'success',
        data:count
      })
    } catch (e) {
      return next(e);
    }
  },
};
