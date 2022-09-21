const { User, Order, Product, Administrator } =
  require('../../models/sql').models;
const { Op } = require('sequelize');

module.exports = {
  async index(req, res, next) {
    try {
      let query = [];

      const users = User.count();
      const exported = Order.count({
        where: {
          status: 'COMPLETED',
        },
      });
      const products = Product.count();
      const admin = Administrator.count({
        where: {
          role: ['admin1', 'admin2', 'admin3'],
        },
      });

      const subscribers = User.count({
        where: {
          plan_id: {
            [Op.ne]: null,
          },
        },
      });

      query.push(users, exported, products, admin, subscribers);

      const stats = await Promise.all(query);

      return res.ok({
        message: 'success',
        data: {
          users: stats[0],
          exports: stats[1],
          products: stats[2],
          sub_admin: stats[3],
          subscribers: stats[4],
        },
      });
    } catch (e) {
      return next(e);
    }
  },
};
