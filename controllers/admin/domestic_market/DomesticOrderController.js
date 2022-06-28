const { Op } = require('sequelize/types');

const { DomesticOrder } = require('../../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { status, quantity, order = [['id', 'DESC']] } = req.query;

    const { offset, limit } = req.pagination();

    let where = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (quantity) {
      where.quantity = {
        [Op.lte]: quantity,
      };
    }

    try {
      const { count, rows } = await DomesticOrder.findAndCountAll({
        where,
        order,
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    const { id } = req.params;

    try {
      const order = await DomesticOrder.findOne({
        where: {
          id,
        },
        include: ['domestic_buyer', 'domestic_product'],
      });

      if (!order) {
        return res.notFound({ message: 'Order not found!' });
      }

      return res.ok({ message: 'Success', data: order });
    } catch (error) {
      return next(error);
    }
  },
};
