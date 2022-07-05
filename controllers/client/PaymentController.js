const { Payment } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const user = req.user;
    let { limit = 30, page = 1 } = req.query;

    if (!user?.id) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'Bad request: provide a user id.',
      });
    }

    if (limit > 100) {
      limit = 100;
    }

    page = Number(page);

    const offset = Math.floor(limit * (page - 1));

    try {
      const { count, rows } = await Payment.findAndCountAll({
        where: {
          user_id: user.id,
        },
        limit,
        offset,
      });

      const meta = {
        pages: Math.ceil(count / limit),
        total: count,
      };

      return res.status(200).json({
        status: 'ok',
        message: 'Payments fetched successfully.',
        data: rows,
        meta,
      });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    const {
      reference,
      amount_paid,
      method = 'Card',
      processor = 'Paystack',
    } = req.body;

    const user = req.user;

    if (!reference) {
      return res.badRequest({ message: 'Invalid reference.' });
    }

    if (!amount_paid) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'Provide an amount.',
      });
    }

    try {
      const payment = await Payment.findOne({
        where: {
          reference,
        },
      });

      if (payment) {
        return res
          .status(422)
          .json({ status: 'unprocessab;e', message: 'Payment already exits.' });
      }

      // Create payment
      const payload = {
        reference,
        amount_paid,
        status: 'PENDING',
        user_id: user.id,
        method,
        processor,
      };

      await Payment.create(payload);

      return res
        .status(201)
        .json({ status: 'created', message: 'Payment created.' });
    } catch (error) {
      return next(error);
    }
  },

  async get(req, res, next) {
    const { reference } = req.params;
    const user = req.user;
    try {
      const payment = await Payment.findOne({
        where: {
          reference,
          user_id: user.id,
        },
        include: ['subscription'],
      });

      if (!payment) {
        return res.status(404).json({
          status: 'not-found',
          message: 'Payment not found',
        });
      }

      return res.status(200).json({
        status: 'ok',
        message: 'Payment fetched successfully.',
        data: payment,
      });
    } catch (error) {
      return next(error);
    }
  },
};
