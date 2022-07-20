const { DomesticProduct } = require('../../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    const user = req.user;

    // if (user.country_code != 'NG') {
    //   return res.forbidden({
    //     message: 'You are not allowed to view the domestic market.',
    //   });
    // }
    
    try {
      const { count, rows } = await DomesticProduct.findAndCountAll({
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
      const product = await DomesticProduct.findOne({
        where: {
          id,
        },
      }).catch((err) => console.error(err));

      if (!product) {
        return res.notFound({ message: 'Product not found!' });
      }

      return res.ok({ message: 'Success', data: product });
    } catch (error) {
      return next(error);
    }
  },
};
