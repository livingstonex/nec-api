const { Op } = require('sequelize');
const { Order, User } = require('../../../models/sql').models;
const Email = require('../../../utils/email.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    const { buyer_id, seller_id, order = [['id', 'DESC']] } = req.query;

    let where = {};

    if (buyer_id) {
      where.buyer_id = buyer_id;
    }

    if (seller_id) {
      where.seller_id = seller_id;
    }

    try {
      const { count, rows } = await Order.findAndCountAll({
        where,
        offset,
        limit,
        order,
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
        include: ['buyer', 'seller', 'product'],
      }).catch((err) => console.error(err));

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
    const { seller_id } = req.body;

    if (!seller_id) {
      return res.badRequest({
        message: 'Please attach a seller',
      });
    }

    const data = {
      seller_id,
      status: "MATCHING_COMPLETED"
    };

    try {
      const user = await User.findOne({
        where: { id: seller_id },
      });

      if(!user) {
        return res.notFound({message: "Seller not found. Invalid seller provided."})
      }

      const updated_order = await Order.update(data, {
        where: {
          id,
        },
      });

      if (!updated_order[0]) {
        return res.unprocessable({
          message: 'We could not process the update, please try again!',
        });
      }

      const order = await Order.findOne({
        where: {
          id,
        },
        include: ['product'],
      });

      const seller = await order.getSeller();

      const seller_data = {
        seller_name: seller.fullname,
        product_name: order?.product?.name,
        tracking_id: order?.tracking_id,
      };

      Email.sendEmailTemplate({
        to: [{ email: seller.email, name: seller.fullname }],
        templateName: 'order-matching-seller-notification',
        templateData: seller_data,
        subject: 'NEC: New Order Matching',
      }).catch(console.error());

      return res.ok({
        message: 'Status successfully updated.',
      });
    } catch (error) {
      return next(error);
    }
  },
};
