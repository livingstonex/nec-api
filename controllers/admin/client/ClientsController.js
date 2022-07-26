const { User } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
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
  async get(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: {
          id,
        }
      }).catch((err) => console.error(err));

      if (!user) {
        return res.notFound({ message: 'user not found!' });
      }

      return res.ok({ message: 'Success', data: user });
    } catch (error) {
      return next(error);
    }
  },
}
