const Validator = require('../../utils/validator.utils');
const sendTokenResponse = require('../../utils/sendTokenResponse.utils');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { Administrator } = require('../../models/sql').models;

module.exports = {
  async register(req, res, next) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.badRequest({
          message: 'Please fill in all the fields, they are all required',
        });
      }

      const passwordValid = Validator.passwordChecker(password);

      if (!passwordValid) {
        return res.badRequest({
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const [admin, created] = await Administrator.findOrCreate({
        where: { username },
        defaults: { password: hashedPassword, role },
      });
      if (created) {
        admin.password = undefined;
        return sendTokenResponse(
          admin,
          res,
          201,
          'Admin created  successfully'
        );
      }
      return res.unprocessable({ message: 'Admin already exists' });
    } catch (e) {
      return next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const errors = {};

      if (!username) {
        errors.username = 'Invalid login data!';
      }

      if (!password) {
        errors.password = 'Password is required!';
      }

      if (Object.keys(errors).length > 0) {
        return res.badRequest({
          message: 'Username and password are required',
        });
      }

      const admin = await Administrator.findOne({ where: { username } });

      if (!admin) {
        return res.badRequest({ msg: 'Invalid login details!' });
      }

      if(!admin.active){
        return res.forbidden({
          message:"This account has been deactivated by the supper admin"
        })
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.badRequest({ msg: 'Invalid login details!' });
      }
      admin.password = undefined;
      return sendTokenResponse(admin, res, 200, 'Admin login successful');
    } catch (e) {
      return next(e);
    }
  },

  async logout(req, res) {
    res.cookie('nec-cookie', 'none', {
      expires: new Date(Date.now() - 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: 'ok',
      data: {},
      message: 'Logout successful',
    });
  },

  async deactivateAdmin(req, res, next) {
    const { id } = req.params;
    try {
      const admin = await Administrator.findOne({
        where: {
          [Op.and]: [{ id }, { active: true }],
        },
      });
      if (!admin) {
        return res.notFound({
          message: 'this admin does not exist',
        });
      }
      const update = Administrator.update(
        { active: false },
        {
          where: {
            id,
          },
        }
      );

      return res.ok({
        message: 'admin deactivated successfully',
      });
    } catch (e) {
      next(e);
    }
  },
  
  async activateAdmin(req, res, next) {
    const { id } = req.params;
    try {
      const admin = await Administrator.findOne({
        where: {
          [Op.and]: [{ id }, { active: false }],
        },
      });
      if (!admin) {
        return res.notFound({
          message: 'this admin does not exist',
        });
      }
      const update = Administrator.update(
        { active: true },
        {
          where: {
            id,
          },
        }
      );

      return res.ok({
        message: 'admin activated successfully',
      });
    } catch (e) {
      next(e);
    }
  },
  async admins(req, res, next) {
    try {
      const admins = await Administrator.findAll({
        where: {
          role: ['admin1', 'admin2', 'admin3'],
        },
      });
      if (!admins) {
        return res.notFound({
          message: 'no admins found. Please add an admin',
        });
      }
      return res.ok({
        message: 'admins retrieved successfully',
        data: admins,
      });
    } catch (e) {
      next(e);
    }
  },
};
