const { User, Subscription, Plan, Privilege } =
  require('../../../models/sql').models;
const { Op } = require('sequelize');

module.exports = {
  async index(req, res, next) {
    const { role } = req.query;
    const { offset, limit } = req.pagination();

    let where = {};

    if (role) {
      where.role = role.toUpperCase();
    }

    try {
      const { count, rows } = await User.findAndCountAll({
        where,
        offset,
        limit,
        include: ['sells', 'products'],
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },

  async get(req, res, next) {
    const { id } = req.params;
    const { role } = req.query;

    let where = { id };

    if (role) {
      where.role = role.toUpperCase();
    }

    try {
      const user = await User.findOne({
        where,
      }).catch((err) => console.error(err));

      if (!user) {
        return res.notFound({ message: 'user not found!' });
      }

      return res.ok({ message: 'Success', data: user });
    } catch (error) {
      return next(error);
    }
  },

  async getVerifiedOrUnverifiedUsers(req, res, next) {
    let { status } = req.params;
    const { offset, limit } = req.pagination();
    let newStatus;

    switch (status) {
      case 'verified':
        newStatus = true;
        break;

      case 'unverified':
        newStatus = false;
        break;
      default:
        return res.badRequest({
          message: 'Invalid status passed',
        });
    }

    try {
      const { count, rows } = await User.findAndCountAll({
        where: {
          is_verified: newStatus,
        },
        include: [
          {
            model: Subscription,
            as: 'subscription',
            include: [
              {
                model: Plan,
                as: 'plan',
                include: [
                  {
                    model: Privilege,
                    as: 'privileges',
                    attributes: {
                      exclude: ['created_at', 'updated_at', 'plan_id'],
                    },
                  },
                ],
              },
            ],
          },
        ],
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },

  async subscribers(req, res, next) {
    const { offset, limit } = req.pagination();

    try {
      const { count, rows } = await User.findAndCountAll({
        where: {
          plan_id: {
            [Op.ne]: null,
          },
        },
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);
      return res.ok({ message: 'Success', data: rows, meta });
    } catch (e) {
      next(e);
    }
  },
  async getVerifiedUser(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: {
          id,
          is_verified: true,
        },
        include: [
          {
            model: Subscription,
            as: 'subscription',
            include: [
              {
                model: Plan,
                as: 'plan',
                include: [
                  {
                    model: Privilege,
                    as: 'privileges',
                    attributes: {
                      exclude: ['created_at', 'updated_at', 'plan_id'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.notFound({ message: 'user not found!' });
      }

      return res.ok({ message: 'Success', data: user });
    } catch (e) {
      return next(e);
    }
  },
};
