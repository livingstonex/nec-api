const { Order } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    const user = req.user;

    try {
      const { count, rows } = await Order.findAndCountAll({
        where: {
          buyer_id: user.id,
        },
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },

  async get(req, res, next) {
    const { id } = req.params;

    try {
      const order = await Order.findOne({
        where: {
          id,
        },
      }).catch((err) => console.error(err));

      if (!order) {
        return res.notFound({ message: 'Order not found!' });
      }

      return res.ok({ message: 'Success', data: order });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const { quantity, specification, message } = req.body;
    let errors = {};
    const user = req.user;

    if (!quantity) {
      errors.quantity = 'Please provide a quantity';
    }

    if (!specification) {
      errors.specification = 'Please provide a specification';
    }

    if (!message) {
      errors.message = 'Please provide a message';
    }

    if (Object.keys(errors).length > 0) {
      return res.badRequest({
        message: 'Please provide all required fields.',
        error: errors,
      });
    }
  },
};
