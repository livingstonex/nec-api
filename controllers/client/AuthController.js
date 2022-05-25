const Sequelize = require('sequelize');
const { User, PasswordReset } = require('../../models/sql').models;
const Error = require('../../utils/errorResponse');
const Validator = require('../../utils/validator.utils');
const bcrypt = require('bcryptjs');
const Utils = require('../../utils/utils');
const Email = require('../../utils/email.utils');
const Time = require('../../utils/time.utils');
const Config = require('../../utils/config.utils');
const crypto = require('crypto');

// module.exports = Register;
module.exports = {
  async register(req, res, next) {
    try {
      const { email, fullname, phone, password } = req.body;

      if (email == '' || password == '' || phone == '' || fullname == '') {
        return res.status(400).json({
          status: 'error',
          message: 'Please fill in all the fields, they are all required',
          data: '',
        });
      }

      const passwordValid = Validator.passwordChecker(password);

      if (!passwordValid) {
        return res.status(400).json({
          status: 'error',
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
          data: '',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const emailChecker = Validator.validateEmail(email);
      if (!emailChecker) {
        return res.status(400).json({
          status: 'failed',
          message: 'Please enter a valid email',
          data: '',
        });
      }

      const validPhoneNumber = Validator.phoneNumberChecker(phone);

      if (!validPhoneNumber) {
        res.status(400).json({
          status: 'failed',
          message: 'please enter a valid phone number',
          data: '',
        });
      }
      const verification_token = crypto.randomBytes(20).toString('hex');
      const verification_token_epires_in = Time.add(1, 'day', Date.now());

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          fullname,
          password: hashedPassword,
          phone,
          email,
          verification_token,
          verification_token_expires: verification_token_epires_in,
        },
      });
      if (created) {
        //send email with verification link

        const reset_link = `${
          req.protocol +
          '://' +
          req.get('host') +
          '/api/client/verifyemail' +
          '/' +
          verification_token
        }`;
        console.log(reset_link);
        const data = { link: reset_link };

        const send_verification_link = Email.sendEmailTemplate({
          to: email,
          templateName: 'body.ejs',
          templateData: data,
          subject: 'please verify your email',
          opts: {},
        });

        return res.status(200).json({
          status: 'ok',
          message:
            'We have sent a verification link to your email, Please clink on the link to verify your email',
          data: user,
        });
      } else {
        return res.status(422).json({
          status: 'unprocessable',
          message: `A user with ${email} already exist`,
          data: '',
        });
      }
    } catch (e) {
      return next(e);
    }
  },

  

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'bad-request',
          message: 'Please provide an email address.',
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: 'not-found',
          message: `User with the email ${email} not found.`,
        });
      }

      await PasswordReset.destroy({
        where: { email },
      });

      const resetToken = Utils.getRandomString(14);

      await PasswordReset.create({
        email,
        token: resetToken,
      });

      //   Send email
      // Email.sendEmailTemplate
      return res.status(201).json({
        status: 'created',
        message:
          'Password reset link sent! Please check your email inbox for a reset link',
      });
    } catch (error) {
      return next(error);
    }
  },

  async resetPasswordByLink(req, res, next) {
    try {
      let { token } = req.params;
      const { password } = req.body;

      const isPasswordValid = Validator.passwordChecker(password);

      if (!isPasswordValid) {
        return res.status(400).json({
          status: 'bad-request',
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters, at least a number and a special character',
        });
      }

      token = token.trim();

      const passwordReset = await PasswordReset.findOne({
        where: {
          created_at: {
            [Sequelize.Op.gt]: Time.startOfDay(),
          },
          token,
        },
      });

      if (!passwordReset) {
        return res.status(422).json({
          status: 'unprocessable',
          message: 'Your reset token is either invalid or expired.',
        });
      }

      const userEmail = passwordReset.email;

      const user = await User.findOne({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        return res.status(422).json({
          status: 'unprocessable',
          message: 'Noa ccount is attached to this token.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const data = {
        password: hashedPassword,
      };

      // Update user password
      await User.update(data, {
        where: {
          email: user.email,
        },
      });

      await PasswordReset.destroy({ where: { email: user.email } });

      return res
        .status(200)
        .json({ status: 'ok', message: 'Password reset successful.' });
    } catch (error) {
      return next(error);
    }
  },
};
