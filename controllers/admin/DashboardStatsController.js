const { User, Order, Product, Administrator } =
  require('../../models/sql').models;
  const { Op } = require('sequelize');

module.exports = {
  async index(req, res, next) {
    try {
      let query = [];

      const users = User.findAll();
      const exported = Order.findAll({
        where: {
          status: 'COMPLETED',
        },
      });
      const products = Product.findAll();
      const admin = Administrator.findAll({
        where: {
          role: ['admin1', 'admin2', 'admin3'],
        },
      });

      const members = User.findAll({
        where: {
          plan_id: {
            [Op.ne]: null,
          },
        },
      });

      query.push(users, exported, products, admin,members);

      const stats = await Promise.all(query);

      return res.ok({
        message: 'success',
        data: {
          users: stats[0].length,
          exports: stats[1].length,
          products: stats[2].length,
          sub_admin: stats[3].length,
          members:stats[4].length
        },
      });
    } catch (e) {
      return next(e);
    }
  },
};
