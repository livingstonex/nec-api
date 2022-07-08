// const { Op } = require('sequelize/types');
const Sequelize = require('sequelize');
const { DomesticOrder } = require('../../../models/sql').models;
const Email = require('../../../utils/email.utils');

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
        [Sequelize.Op.lte]: quantity,
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

  async update(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.badRequest({
        message: 'Please attach a valid status',
      });
    }

    const data = {
      status: status.toUpperCase(),
    };

    try {
      const domestic_order_status = await DomesticOrder.update(data, {
        where: {
          id,
        },
      });

      if (!domestic_order_status[0]) {
        return res.unprocessable({
          message: 'We could not process the update, please try again!',
        });
      }

      const order = await DomesticOrder.findOne({
        where: {
          id,
        },
        include: ['domestic_product', 'domestic_buyer'],
      });

      const buyer = order.domestic_buyer;

      const buyer_data = {
        buyer_name: buyer.fullname,
        product_name: order?.domestic_product?.name,
        status,
      };

      Email.sendEmailTemplate({
        to: [{ email: buyer.email, name: buyer.fullname }],
        templateName: 'order-update-buyer-notification',
        templateData: buyer_data,
        subject: 'NEC: Order Status Notification',
      }).catch(console.error());

      return res.ok({
        message: 'Status successfully updated.',
      });
    } catch (error) {
      return next(error);
    }
  },
};
