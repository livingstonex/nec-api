const { Category } = require('../models/sql').models;
const cloudinaryUtils = require('../utils/cloudinary.utils');
const Env = require('../utils/env.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await Category.findAndCountAll({
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
      const category = await Category.findOne({
        where: {
          id,
        },
        include: ['products'],
      }).catch((err) => console.error(err));

      if (!category) {
        return res.notFound({ message: 'Category not found!' });
      }

      return res.ok({ message: 'Success', data: category });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!req.files || !req.files?.image) {
        return res.badRequest({
          message: 'Please provide a category image.',
        });
      }

      if (!name || !description) {
        return res.badRequest({
          message:
            'Invalid name or description entered. Please provide a name and a description.',
        });
      }

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files?.image?.tempFilePath,
        Env.get('NEC_CLOUDINARY_CATEGORY_FOLDER') || 'categories'
      );

      const payload = {
        description,
        image_url: url,
        image_id: public_id,
      };

      const [category, created] = await Category.findOrCreate({
        where: { name },
        defaults: payload,
      });

      if (!created) {
        return res.unprocessable({ mesage: 'Category already exists.' });
      }

      return res.created({
        message: 'Plan created successfully.',
        data: category,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const { id: category_id } = req.params;

    const { name, description } = req.body;

    let data = {};

    if (name) {
      data.name = name;
    }

    if (description) {
      data.description = description;
    }

    try {
      if (req.files || req.files?.image) {
        const category = await Category.findOne({
          where: {
            id: category_id,
          },
        });

        await cloudinaryUtils.deleteFile(category.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files?.image?.tempFilePath,
          Env.get('NEC_CLOUDINARY_CATEGORY_FOLDER') || 'categories'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

      await Category.update(data, {
        where: {
          id: category_id,
        },
      });

      return res.ok({
        message: 'Category updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },
};
