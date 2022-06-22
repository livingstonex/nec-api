const { Order } = require('../../models/sql').models;
const Email = require('../../utils/email.utils');

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
        include: ['buyer'],
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },

  async index_seller(req, res, next) {
    const { offset, limit } = req.pagination();
    const user = req.user;

    try {
      const { count, rows } = await Order.findAndCountAll({
        where: {
          seller_id: user.id,
        },
        offset,
        limit,
        include: ['seller'],
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
    const { status } = req.body;

    if (!status) {
      return res.badRequest({
        message: 'Please attach a valid status',
      });
    }

    const data = {
      state: status.toUpperCase(),
    };

    try {
      const order_status = await Order.update(data, {
        where: {
          id,
        },
      });

      if (!order_status[0]) {
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

      const buyer = order.getBuyer();
      const seller = order.getSeller();

      const buyer_data = {
        buyer_name: buyer.fullname,
        product_name: order?.product?.name,
        status,
      };

      const seller_data = {
        seller_name: seller.fullname,
        product_name: order?.product?.name,
        status,
      };

      Email.sendEmailTemplate({
        to: [{ email: buyer.email, name: buyer.fullname }],
        templateName: 'order-update-buyer-notification',
        templateData: buyer_data,
        subject: 'NEC: Order Status Notification',
      }).catch(console.error());

      Email.sendEmailTemplate({
        to: [{ email: seller.email, name: seller.fullname }],
        templateName: 'order-update-seller-notification',
        templateData: seller_data,
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
