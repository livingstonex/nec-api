const { DomesticTrader, DomesticMarketTraders } =
  require('../../../models/sql').models;
const Validator = require('../../../utils/validator.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await DomesticTrader.findAndCountAll({
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
      const trader = await DomesticTrader.findOne({
        where: {
          id,
        },
        include: ['domestic_trader_markets', 'domestic_trader_products'],
      }).catch((err) => console.error(err));

      if (!trader) {
        return res.notFound({ message: 'Trader not found!' });
      }

      return res.ok({ message: 'Success', data: product });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const { name, address, email, phone, domestic_market_id } = req.body;

    try {
      let errors = {};

      if (!name) {
        errors.name = 'Please provide a trader name';
      }

      if (!address) {
        errors.address = 'Please provide a trader address';
      }

      if (!email) {
        errors.email = 'Please provide a trader email';
      }

      if (!phone) {
        errors.phone = 'Please provide a trader phone';
      }

      if (!domestic_market_id) {
        errors.domestic_market_id = 'Please provide a trader domestic market';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const emailChecker = Validator.validateEmail(email);

      if (!emailChecker) {
        return res.status(400).json({
          status: 'failed',
          message: 'Please enter a valid email',
          data: '',
        });
      }

      const validPhoneNumber = Validator.phoneNumberChecker(phone);

      if (!validPhoneNumber) {
        res.status(400).json({
          status: 'failed',
          message: 'please enter a valid phone number',
          data: '',
        });
      }
      const payload = { name, address, email, phone };

      const trader = await DomesticTrader.create(payload);

      const data1 = {
        domestic_market_id,
        domestic_trader_id: trader.id,
      };

      await DomesticMarketTraders.create(data1);

      return res.created({ message: 'Domestic trader created successfully.' });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const { id: trader_id } = req.params;

    const { name, address, email, phone, domestic_market_id } = req.body;

    let data = {};

    if (name) {
      data.name = name;
    }

    if (address) {
      data.address = address;
    }

    if (email) {
      data.email = email;
    }

    if (phone) {
      data.phone = phone;
    }

    try {
      await DomesticTrader.update(data, {
        where: {
          id: trader_id,
        },
      });

      if (domestic_market_id) {
        const old_domestic_market = await DomesticTrader.findOne({
          where: {
            id: trader_id,
          },
          include: ['domestic_trader_markets'],
        });
        const join_payload = {
          domestic_market_id,
          domestic_trader_id: trader_id,
        };

        await DomesticMarketTraders.update(join_payload, {
          where: {
            domestic_trader_id: trader_id,
            domestic_market_id:
              old_domestic_market?.domestic_trader_markets[0]?.id,
          },
        });
      }

      return res.ok({
        message: 'Domestic trader updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const product = await DomesticTrader.findOne({
        where: {
          id,
        },
      });

      let promises = [];

      promises.push(DomesticTrader.destroy({ where: { id } }));

      promises.push(
        DomesticMarketTraders.destroy({
          where: { domestic_trader_id: id },
        })
      );

      promises.push(
        DomesticTraderProduct.destroy({
          where: { domestic_trader_id: id },
        })
      );

      await Promise.all(promises);

      return res.ok({ message: 'Product deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  },
};
