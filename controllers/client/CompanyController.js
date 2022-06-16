const { Company } = require('../../models/sql').models;

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await Company.findAndCountAll({
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
      const company = await Company.findOne({
        where: {
          id,
        },
      }).catch((err) => console.error(err));

      if (!company) {
        return res.notFound({ message: 'Company not found!' });
      }

      return res.ok({ message: 'Success', data: company });
    } catch (error) {
      return next(error);
    }
  },

  async getUserCompany(req, res, next) {
    const user = req.user;

    try {
      const company = await Company.findOne({
        where: {
          user_id: user?.id,
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

  async create(req, res, next) {
    const { name, description, cac_number, business_address } = req.body;
    let errors = {};
    const user = req.user;

    try {
      if (!name) {
        errors.name = 'Please provide a company name';
      }

      if (!description) {
        errors.description = 'Please provide a company description';
      }

      if (!cac_number) {
        errors.cac_number = 'Please provide a company cac_number';
      }

      if (!business_address) {
        errors.business_address = 'Please provide a company business address';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const payload = {
        name,
        description,
        cac_number,
        business_address,
        user_id: user.id,
      };

      const company = await Company.create(payload);

      return res.created({
        message: 'Company created successfully.',
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const { id: company_id } = req.params;
    const { name, description, cac_number, business_address } = req.body;
    let data = {};

    if (name) {
      data.name = name;
    }

    if (description) {
      data.description = description;
    }

    if (cac_number) {
      data.cac_number = name;
    }

    if (business_address) {
      data.business_address = business_address;
    }

    try {
      await Company.update(data, {
        where: {
          id: company_id,
        },
      });

      return res.ok({
        message: 'Company updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },
};