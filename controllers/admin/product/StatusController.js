const { Product } = require('../../models/sql').models;

module.exports = {
  async update(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.badRequest({
        message: 'Please attach a status',
      });
    }

    const data = {
      status,
    };

    try {
      const product = await Product.update(data, {
        where: {
          id,
        },
      });

      if (!product) {
        return res.unprocessable({
          message: 'We could not process the update, please try again!',
        });
      }

      return res.ok({
        message: `Status successfully updated to: ${status}`,
      });
    } catch (error) {
      return next(error);
    }
  },
};
