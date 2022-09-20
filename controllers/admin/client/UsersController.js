const { User, Subscription, Plan, Privilege } =
  require('../../../models/sql').models;
const { Op } = require('sequelize');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await User.findAndCountAll({
        where: {
          role: 'EXPORTER',
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
      const user = await User.findOne({
        where: {
          id,
          role: 'EXPORTER',
        },
      }).catch((err) => console.error(err));

      if (!user) {
        return res.notFound({ message: 'user not found!' });
      }

      return res.ok({ message: 'Success', data: user });
    } catch (error) {
      return next(error);
    }
  },
  async getVerifiedUsers(req, res, next) {
    let { status } = req.params;
    const { offset, limit } = req.pagination();
    status = status === 'verified' ? true : false;
    try {
      const { count, rows } = await User.findAndCountAll({
        where: {
          is_verified: status,
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

      if (!rows) {
        return res.notFound({ message: 'users not found!' });
      }
      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },
  async allUsers(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await User.findAndCountAll({
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },
  async members(req, res, next) {
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
      if (!rows) {
        return res.notFound({ message: 'user not found!' });
      }
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
