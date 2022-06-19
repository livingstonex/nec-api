const { Order } = require('../../models/sql').models;
const cloudinaryUtils = require('../../utils/cloudinary.utils');
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
    const { quantity, specification, message, product_id, product_name } =
      req.body;
    let errors = {};
    const user = req.user;

    try {
      if (!req.files || !req.files.image) {
        return res.badRequest({
          message: 'Please provide a product image.',
        });
      }

      if (!quantity) {
        errors.quantity = 'Please provide a quantity';
      }

      if (!specification) {
        errors.specification = 'Please provide a specification';
      }

      if (!message) {
        errors.message = 'Please provide a message';
      }

      if (!product_id) {
        errors.product_id = 'Please provide a product id';
      }

      if (!product_name) {
        errors.product_name = 'Please provide a product name';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files.image.tempFilePath,
        Env.get('NEC_CLOUDINARY_ORDERS_FOLDER') || 'orders'
      );

      const payload = {
        quantity,
        specification,
        message,
        image_url: url,
        image_id: public_id,
        type: 'IMPORT',
        status: 'PENDING',
        buyer_id: user.id,
        product_id,
      };

      await Order.create(payload);

      const data = {
        name: user.fullname,
        email: user.email,
        product: product_name,
        quantity,
      };

      Email.sendEmailTemplate({
        to: [
          { email: user.email, name: user.fullname },
          { email: 'zeenabgroupict@gmail.com', name: 'Zeenab Group' },
        ],
        templateName: 'new-order-notification',
        templateData: data,
        subject: 'NEC: New Order',
      }).catch(console.error());

      return res.created({
        message: 'Order created successfully.',
        data: product,
      });
    } catch (error) {
      return next(error);
    }
  },
};
