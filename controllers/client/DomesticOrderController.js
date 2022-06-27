const { DomesticOrder } = require('../../models/sql').models;
const Email = require('../../utils/email.utils');

module.exports = {
  async index(req, res, next) {
    const user = req.user;
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await DomesticOrder.findAndCountAll({
        where: {
          buyer_id: user.id,
        },
        offset,
        limit,
      });
      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      next(error);
    }
  },

  async index_seller(req, res, next) {
    const user = req.user;
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await DomesticOrder.findAndCountAll({
        where: {
          seller_id: user.id,
        },
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
        Env.get('NEC_CLOUDINARY_DOMESTIC_ORDERS_FOLDER') || 'domestic-orders'
      );

      const payload = {
        quantity,
        specification,
        message,
        image_url: url,
        image_id: public_id,
        type: 'DOMESTIC_IMPORT',
        status: 'PENDING',
        buyer_id: user.id,
        domestic_product_id: product_id,
        tracking_id: crypto.randomUUID().split('-').join('').toUpperCase(),
      };

      const domestic_order = await DomesticOrder.create(payload);

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
        templateName: 'new-domestic-order-notification',
        templateData: data,
        subject: 'NEC: New Domestic Order',
      }).catch(console.error());

      return res.created({
        message: 'Order created successfully.',
        data: domestic_order,
      });
    } catch (error) {
      return next(error);
    }
  },
};
