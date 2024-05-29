const { Company } = require('../../models/sql').models;

module.exports = {
  async get(req, res, next) {
    const { id: user_id } = req.params;

    try {
      const company = await Company.findOne({
        where: {
          user_id,
        },
      }).catch((err) => console.error(err));

      if (!company) {
        return res.notFound({ message: 'No company found for this user.' });
      }

      return res.ok({ message: 'Success', data: company });
    } catch (error) {
      return next(error);
    }
  },
};
