const { DomesticMarket, DomesticMarketProduct, DomesticMarketTraders } =
  require('../../../models/sql').models;

const cloudinaryUtils = require('../../../utils/cloudinary.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await DomesticMarket.findAndCountAll({
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
      const market = await DomesticMarket.findOne({
        where: {
          id,
        },
        include: ['domestic_market_traders', 'domestic_market_products'],
      }).catch((err) => console.error(err));

      if (!market) {
        return res.notFound({ message: 'Market not found!' });
      }

      return res.ok({ message: 'Success', data: market });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const { name, address, description } = req.body;

    let errors = {};

    try {
      if (!req.files || !req.files.image) {
        return res.badRequest({
          message: 'Please provide a market image.',
        });
      }

      if (!name) {
        errors.name = 'Please provide a market name';
      }

      if (!address) {
        errors.address = 'Please provide a market address';
      }

      if (!description) {
        errors.description = 'Please provide a market description';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files.image.tempFilePath,
        Env.get('NEC_CLOUDINARY_DOMESTIC_MARKETS_FOLDER') || 'domestic_markets'
      );

      const payload = {
        name,
        address,
        description,
        image_url: url,
        image_id: public_id,
      };

      const market = await DomesticMarket.create(payload);

      if (!market) {
        res.serverError({
          message:
            'sorry we could not create product now. Please try again later.',
        });
      }

      return res.created({
        message: 'Domestic market created successfully.',
        data: market,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    const { id: domestic_market_id } = req.params;

    const { name, address, description } = req.body;

    let data = {};

    if (name) {
      data.name = name;
    }

    if (address) {
      data.address = address;
    }

    if (description) {
      data.description = description;
    }

    try {
      if (req.files || req.files?.image) {
        const domestic_market = await DomesticMarket.findOne({
          where: {
            id: domestic_market_id,
          },
        });

        await cloudinaryUtils.deleteFile(domestic_market.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files.image.tempFilePath,
          Env.get('NEC_CLOUDINARY_DOMESTIC_MARKET_FOLDER') || 'domestic_market'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

      await DomesticMarket.update(data, {
        where: {
          id: domestic_market_id,
        },
      });

      return res.ok({
        message: 'Market details updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const market = await DomesticMarket.findOne({
        where: {
          id,
        },
      });

      let promises = [];

      promises.push(cloudinaryUtils.deleteFile(product.image_id));
      promises.push(DomesticMarket.destroy({ where: { id } }));

      promises.push(
        DomesticMarketProduct.destroy({
          where: { domestic_market_id: id },
        })
      );

      promises.push(
        DomesticMarketTraders.destroy({
          where: { domestic_market_id: id },
        })
      );

      await Promise.all(promises);

      return res.ok({ message: 'Market deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  },
};
