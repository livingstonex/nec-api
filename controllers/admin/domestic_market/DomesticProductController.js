const cloudinaryUtils = require('../../../utils/cloudinary.utils');
const { DomesticMarketProduct, DomesticTraderProduct, DomesticProduct } =
  require('../../../models/sql').models;
const Env = require('../../../utils/env.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    const { name, quantity, order = [['id', 'DESC']] } = req.query;

    let where = {};

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (quantity) {
      where.quantity = {
        [Op.lte]: quantity,
      };
    }

    try {
      const { count, rows } = await DomesticProduct.findAndCountAll({
        where,
        order,
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
      const product = await DomesticProduct.findOne({
        where: {
          id,
        },
        include: ['domestic_product_traders', 'domestic_product_markets'],
      });

      if (!product) {
        return res.notFound({ message: 'Domestic Product not found!' });
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
      name,
      description,
      quantity,
      specification,
    } = req.body;

    let errors = {};

    try {
      if (!req.files || !req.files?.image) {
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

      if (!name) {
        errors.name = 'Please provide a product name';
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
        req.files?.image?.tempFilePath,
        Env.get('NEC_CLOUDINARY_DOMESTIC_PRODUCTS_FOLDER') ||
          'domestic_products'
      );

      const payload = {
        name,
        description,
        quantity,
        specification,
        image_url: url,
        image_id: public_id,
      };

      const product = await DomesticProduct.create(payload);

      const data1 = {
        domestic_market_id,
        domestic_product_id: product.id,
      };

      const data2 = {
        domestic_trader_id,
        domestic_product_id: product.id,
      };

      await Promise.all([
        DomesticMarketProduct.create(data1),
        DomesticTraderProduct.create(data2),
      ]);

      return res.created({
        message: 'Domestic product created successfully.',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    const { id: domestic_product_id } = req.params;

    const {
      // domestic_trader_id,
      // domestic_market_id,
      name,
      description,
      quantity,
      specification,
    } = req.body;

    let data = {};

    if (name) {
      data.name = name;
    }

    if (description) {
      data.description = description;
    }

    if (quantity) {
      data.quantity = quantity;
    }

    if (specification) {
      data.specification = specification;
    }

    try {
      if (req.files || req.files?.image) {
        const domestic_product = await DomesticProduct.findOne({
          where: {
            id: domestic_product_id,
          },
        });

        await cloudinaryUtils.deleteFile(domestic_product.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files?.image?.tempFilePath,
          Env.get('NEC_CLOUDINARY_DOMESTIC_PRODUCT_FOLDER') ||
            'domestic_products'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

      await DomesticProduct.update(data, {
        where: {
          id: domestic_product_id,
        },
      });

      // if (domestic_market_id) {
      //   const domestic_product = await DomesticProduct.findOne({
      //     where: {
      //       id: domestic_product_id,
      //     },
      //     include: ['domestic_product_markets', 'domestic_product_traders'],
      //   });

      //   const join_data1 = {
      //     domestic_market_id,
      //     domestic_product_id,
      //   };

      //   const join_data2 = {
      //     domestic_trader_id: domestic_product?.domestic_product_traders[0]?.id,
      //     domestic_product_id: domestic_product?.id,
      //   };

      //   let promises = [];

      //   promises.push(
      //     DomesticMarketProduct.update(join_data1, {
      //       where: {
      //         domestic_market_id:
      //           domestic_product?.domestic_product_markets[0]?.id,
      //         domestic_product_id: domestic_product.id,
      //       },
      //     })
      //   );

      //   promises.push(
      //     DomesticTraderProduct(join_data2, {
      //       where: {
      //         domestic_trader_id:
      //           domestic_product?.domestic_product_traders[0]?.id,
      //         domestic_product_id: domestic_product?.id,
      //       },
      //     })
      //   );

      //   await Promise.all(promises);
      // }

      return res.ok({
        message: 'Domestic Product updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const product = await DomesticProduct.findOne({
        where: {
          id,
        },
      });

      let promises = [];

      promises.push(cloudinaryUtils.deleteFile(product.image_id));

      promises.push(DomesticProduct.destroy({ where: { id } }));

      promises.push(
        DomesticMarketProduct.destroy({
          where: { domestic_product_id: product.id },
        })
      );

      promises.push(
        DomesticTraderProduct.destroy({
          where: { domestic_product_id: product.id },
        })
      );

      await Promise.all(promises);

      return res.ok({ message: 'Product deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  },
};
