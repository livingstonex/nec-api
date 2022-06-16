const { Product } = require('../models/sql').models;
const cloudinaryUtils = require('../utils/cloudinary.utils');
const Env = require('../utils/env.utils');

module.exports = {
  async index(req, res, next) {
    const { offset, limit } = req.pagination();
    try {
      const { count, rows } = await Product.findAndCountAll({
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
      const product = await Product.findOne({
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

  async getUserProducts(req, res, next) {
    const { offset, limit } = req.pagination();
    const user = req.user;

    try {
      const { count, rows } = await Product.findAndCountAll({
        where: {
          user_id: user.id,
        },
        offset,
        limit,
      });

      const meta = res.pagination(count, limit);

      return res.ok({ message: 'Success', data: rows, meta });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description, quantity, specification, category_id } =
        req.body;

      if (!req.files || !req.files.image) {
        return res.badRequest({
          message: 'Please provide a product image.',
        });
      }

      let errors = {};

      if (!name) {
        errors.name = 'Provide a name';
      }

      if (!description) {
        errors.description = 'Provide a description';
      }

      if (!quantity) {
        errors.quantity = 'Provide a quantity';
      }

      if (!specification) {
        errors.specification = 'Provide a specification';
      }

      if (!category_id) {
        errors.category_id = 'Provide a category_id';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Please provide all required fields.',
          error: errors,
        });
      }

      const { url, public_id } = await cloudinaryUtils.uploadImage(
        req.files.image.tempFilePath,
        Env.get('NEC_CLOUDINARY_PRODUCT_FOLDER') || 'products'
      );

      const payload = {
        description,
        quantity,
        specification,
        category_id,
        user_id: req.user?.id,
        image_url: url,
        image_id: public_id,
      };

      const [product, created] = await Product.findOrCreate({
        where: { name },
        defaults: payload,
      });

      if (!created) {
        return res.unprocessable({ mesage: 'Product already exists.' });
      }

      return res.created({
        message: 'Product created successfully.',
        data: product,
      });
    } catch (error) {
      return next(error);
    }
  },

  async update(req, res, next) {
    const { id: product_id } = req.params;

    const { name, description, quantity, specification, category_id } =
      req.body;

    let data = {};

    if (name) {
      data.name = name;
    }

    if (description) {
      data.description = description;
    }

    if (quantity) {
      data.quantity = quantity;
    }

    if (specification) {
      data.specification = specification;
    }

    if (category_id) {
      data.category_id = category_id;
    }

    try {
      if (req.files || req.files?.image) {
        const product = await Product.findOne({
          where: {
            id: product_id,
          },
        });

        await cloudinaryUtils.deleteFile(product.image_id);

        const { url, public_id } = await cloudinaryUtils.uploadImage(
          req.files.image.tempFilePath,
          Env.get('NEC_CLOUDINARY_PRODUCT_FOLDER') || 'products'
        );

        data.image_url = url;
        data.image_id = public_id;
      }

      await Product.update(data, {
        where: {
          id: product_id,
        },
      });

      return res.ok({
        message: 'Product updated successfully.',
      });
    } catch (error) {
      return next(error);
    }
  },
};
