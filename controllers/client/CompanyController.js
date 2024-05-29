const { Company } = require('../../models/sql').models;
const cloudinaryUtils = require('../../utils/cloudinary.utils');
const Env = require('../../utils/env.utils');

module.exports = {
  async index(req, res, next) {
    try {
      const company = await Company.findAll();

      return res.ok({ message: 'Success', data: company });
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

  async create(req, res, next) {
    const { name, description, cac_number, business_address } = req.body;
    let errors = {};
    const user = req.user;

    try {
      if (!req.files || !req.files?.image) {
        return res.badRequest({
          message: 'Please provide a company image.',
        });
      }

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

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files?.image?.tempFilePath,
        Env.get('NEC_CLOUDINARY_PARTNER_COMPANY_FOLDER') ||
          'nec_partner_companies'
      );

      const payload = {
        name,
        description,
        cac_number,
        business_address,
        user_id: user.id,
        image_url: url,
        image_id: public_id,
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
      data.cac_number = cac_number;
    }

    if (business_address) {
      data.business_address = business_address;
    }

    try {
      if (req.files || req.files?.image) {
        const company = await Company.findOne({
          where: {
            id: company_id,
          },
        });

        await cloudinaryUtils.deleteFile(company.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files?.image?.tempFilePath,
          Env.get('NEC_CLOUDINARY_USER_COMPANY_FOLDER') || 'nec_user_companies'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

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
