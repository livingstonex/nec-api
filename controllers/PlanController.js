const { Plan } = require('../models/sql').models;

module.exports = {
  async index(req, res, next) {
    try {
      const plans = await Plan.findAll();

      return res
        .status(200)
        .json({ status: 'ok', message: 'Success', data: plans });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, price, code } = req.body;

      if (!name || !price || !code) {
        return res.status(400).json({
          status: 'bad-request',
          message:
            'Invalid price or name entered. Please provide a price, name and price.',
        });
      }

      const payload = { name, price, code };

      const plan = await Plan.create(payload);

      return res.status(201).json({
        status: 'created',
        message: 'Plan created successfully.',
        data: plan,
      });
    } catch (error) {
      return next(error);
    }
  },
};
