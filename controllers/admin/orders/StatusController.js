const { Order } = require('../../../models/sql').models;
const Email = require('../../../utils/email.utils');
//update status if status is other than matching -- if status is matching then seller id can be null, anything else seller id cannot be null.
module.exports = {
  async update(req, res, next) {
    const { id } = req.params;
    const { status,seller_id } = req.body;

    if (!status) {
      return res.badRequest({
        message: 'Please attach a valid status',
      });
    }
    const status_requiring_seller_id = [
      'MATCHING_COMPLETED',
      'ENROUTE',
      'ARRIVED',
      'DELIVERED',
      'COMPLETED',
    ];

    const data = {
      status: status.toUpperCase(),
    };

    if (status_requiring_seller_id.includes(status)) {
      if (!seller_id) {
        return res.badRequest({
          message:
            'This update requires a seller id. Please pass in a seller id',
        });
      }
      data.seller_id = seller_id;
    }

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

      const buyer = await order.getBuyer();
      const seller = await order.getSeller();

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
