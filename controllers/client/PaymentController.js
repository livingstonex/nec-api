const { Payment } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { user_id } = req.body;
    let { limit = 30, page = 1 } = req.query;

    if (!user_id) {
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
          user_id,
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
      user_id,
      method = 'Card',
      processor = 'Paystack',
    } = req.body;

    if (!reference) {
      return res.badRequest({ message: 'Invalid reference.' });
    }

    if (!amount_paid || !user_id) {
      return res.status(400).json({
        status: 'bad-request',
        message: 'Provide a valid amount and user id.',
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
        user_id,
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
    const { id } = req.params;
    const { user_id } = req.body; // Get user_id from the one injected into the request object on auth

    try {
      const payment = await Payment.findOne({
        where: {
          id,
          user_id,
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
