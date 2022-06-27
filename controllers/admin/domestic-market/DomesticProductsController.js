const { UUID } = require('sequelize');
const cloudinaryUtils = require('../../utils/cloudinary.utils');
const { DomesticMarketProduct, DomesticTraderProduct, DomesticProduct } =
  require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await DomesticProduct.findAndCountAll({
        offset,
        limit,
        include: ['domestic_product_traders', 'domestic_product_markets'],
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
      const product = await DomesticProduct.findOne({
        where: {
          id,
        },
      }).catch((err) => console.error(err));

      if (!product) {
        return res.notFound({ message: 'Product not found!' });
      }

      return res.ok({ message: 'Success', data: product });
    } catch (error) {
      return next(error);
    }
  },
  async create(req, res, next) {
    const {
      domestic_trader_id,
      domestic_market_id,
      product_name,
      description,
      quantity,
      specification,
    } = req.body;

    let errors = {};

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

      if (!description) {
        errors.description = 'Please provide a description';
      }

      if (!domestic_trader_id) {
        errors.domestic_trader_id = 'Please provide a domestic trader id';
      }

      if (!product_name) {
        errors.product_name = 'Please provide a product name';
      }
      if (!domestic_market_id) {
        errors.domestic_market_id = 'Please provide a domestic market id';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files.image.tempFilePath,
        Env.get('NEC_CLOUDINARY_DOMESTIC_PRODUCTS_FOLDER') ||
          'domestic products'
      );

      const payload = {
        name: product_name,
        description,
        quantity,
        specification,
        image_url: url,
        image_id: public_id,
      };

      const product = await DomesticProduct.create(payload);

      if (!product) {
        res.serverError({
          message: 'sorry we could not create product now. Please try again',
        });
      }
      const data1 = {
        domestic_market_id,
        domestic_product_id: product.id,
      };

      const data2 = {
        domestic_trader_id,
        domestic_product_id: product.id,
      };

      Promise.all([
        await DomesticMarketProduct.create(data1),
        await DomesticTraderProduct.create(data2),
      ]);

      return res.created({
        message: 'Domestic product created successfully.',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
};
