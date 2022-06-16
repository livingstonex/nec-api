const { Product } = require('../../../models/sql').models;

module.exports = {
  async update(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status != 'boolean') {
      return res.badRequest({
        message: 'Please attach a valid status',
      });
    }

    const data = {
      approved: status,
    };

    try {
      const product_status = await Product.update(data, {
        where: {
          id,
        },
      });

      if (!product_status[0]) {
        return res.unprocessable({
          message: 'We could not process the update, please try again!',
        });
      }

      if (status === false) {
        return res.ok({
          message: 'Status successfully disapproved',
        });
      }

      return res.ok({
        message: 'Status successfully approved.',
      });
    } catch (error) {
      return next(error);
    }
  },
};
