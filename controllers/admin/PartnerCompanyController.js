const { PartnerCompany } = require('../../models/sql').models;
const cloudinaryUtils = require('../../utils/cloudinary.utils');
const Env = require('../../utils/env.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await PartnerCompany.findAndCountAll({
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
      const partner_company = await PartnerCompany.findOne({
        where: {
          id,
        },
      }).catch((err) => console.error(err));

      if (!partner_company) {
        return res.notFound({ message: 'Partner Company not found!' });
      }

      return res.ok({ message: 'Success', data: partner_company });
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

      const partner_company = await PartnerCompany.create(payload);

      return res.created({
        message: 'Partner Company created successfully.',
        data: partner_company,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const { id: partner_company_id } = req.params;
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
      if (req.files || req.files?.image) {
        const partner_company = await PartnerCompany.findOne({
          where: {
            id: partner_company_id,
          },
        });

        await cloudinaryUtils.deleteFile(partner_company.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files?.image?.tempFilePath,
          Env.get('NEC_CLOUDINARY_PARTNER_COMPANY_FOLDER') ||
            'nec_partner_companies'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

      await PartnerCompany.update(data, {
        where: {
          id: partner_company_id,
        },
      });

      return res.ok({
        message: 'Partner Company updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const partner_company = await PartnerCompany.findOne({
        where: {
          id,
        },
      });

      let promises = [];

      promises.push(cloudinaryUtils.deleteFile(partner_company.image_id));
      promises.push(PartnerCompany.destroy({ where: { id } }));

      await Promise.all(promises);

      return res.ok({ message: 'Partner company deleted successfully.' });
    } catch (error) {
      return next(error);
    }
  },
};
