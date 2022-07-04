const Sequelize = require('sequelize');
const crypto = require('crypto');
const { User, PasswordReset, Subscription, Plan, Privilege, Otp } =
  require('../../models/sql').models;
const Error = require('../../utils/errorResponse');
const Validator = require('../../utils/validator.utils');
const sendTokenResponse = require('../../utils/sendTokenResponse.utils');
const bcrypt = require('bcryptjs');
const Utils = require('../../utils/utils');
const Email = require('../../utils/email.utils');
const Time = require('../../utils/time.utils');
const Config = require('../../utils/config.utils');
const cloudinaryUtils = require('../../utils/cloudinary.utils');
const Env = require('../../utils/env.utils');
const SMS = require('../../utils/sms.utils');

// module.exports = Register;
module.exports = {
  async register(req, res, next) {
    try {
      const { email, fullname, phone, password, country_code = '' } = req.body;
      if (email === '' || password === '' || phone === '' || fullname === '') {
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
          country_code,
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

        const data = { link: reset_link, name: fullname };

        Email.sendEmailTemplate({
          to: [{ email, name: fullname }],
          templateName: 'verification',
          templateData: data,
          subject: 'NEC: Account verification',
        }).catch(console.error());

        sendTokenResponse(user, res, 200, 'user signed up successfully');

        // return res.status(200).json({
        //   status: 'ok',
        //   message:
        //     'We have sent a verification link to your email, Please clink on the link to verify your email',
        //   data: user,
        // });
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

  async verifyEmail(req, res, next) {
    try {
      const { verificationcode } = req.params;

      const user = await User.findOne({
        where: {
          verification_token_expires: {
            [Sequelize.Op.gt]: Time.startOfDay(),
          },
          verification_token: verificationcode,
        },
      });

      if (user === null) {
        return res.status(422).json({
          status: 'not-found',
          message: 'Your verification token is either invalid or expired.',
        });
      }

      const data = {
        is_verified: true,
        verification_token: null,
        verification_token_expires: null,
      };
      await User.update(data, {
        where: {
          email: user.email,
        },
      });

      return res.status(201).json({
        status: 'ok',
        message: 'email verified successfully',
      });
    } catch (e) {
      return next(e);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = {};

      if (!email) {
        errors.email = 'Invalid login data!';
      }

      if (!password) {
        errors.password = 'Password is required!';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: 'failed',
          message: 'Email and password is required!',
          data: errors,
        });
      }

      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: Subscription,
            as: 'subscription',
            include: [
              {
                model: Plan,
                as: 'plan',
                include: [
                  {
                    model: Privilege,
                    as: 'privileges',
                    attributes: {
                      exclude: ['created_at', 'updated_at', 'plan_id'],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(400).json({
          status: 'failed',
          message: 'Invalid login details!',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: 'failed',
          message: 'Invalid login details!',
        });
      }
      user.password = undefined;
      return sendTokenResponse(user, res, 200, 'Login successful');
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

      const reset_link = `${
        req.protocol +
        '://' +
        req.get('host') +
        '/client/password/reset' +
        '/' +
        resetToken
      }`;

      // Send email
      const templateData = {
        name: user.fullname,
        link: reset_link,
        title: 'TOKEN',
      };

      if (user.email) {
        Email.sendEmailTemplate({
          to: [{ email: user.email, name: user.fullname }],
          templateName: 'password-request',
          templateData,
          subject: 'NEC: Account Password Reset',
        }).catch(console.error);
      }

      return res.status(201).json({
        status: 'created',
        message:
          'Password reset link sent! Please check your email inbox for a reset link.s',
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
          message: 'No account is attached to this token.',
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

  async uploadAvatar(req, res, next) {
    try {
      // Check if there is an image sent with the upload
      if (!req.files || !req.files.image) {
        return res.status(400).json({
          status: 'bad-request',
          message: 'Please provide an image.',
        });
      }

      // Check if there is an existing avatar
      if (req.user.avatar) {
        await cloudinaryUtils.deleteFile(req.user.avatar_id);
      }

      // Upload new avatar
      const uploadRes = await cloudinaryUtils.uploadImage(
        req.files.image.tempFilePath,
        Env.get('NEC_CLOUDINARY_AVATAR_FOLDER') || 'avatars'
      );

      const { url, public_id } = uploadRes;

      await User.update(
        { avatar: url, avatar_id: public_id },
        { where: { id: req.user.id } }
      );

      return res.status(201).json({
        msg: 'Image uploaded',
        data: { url, public_id },
      });
    } catch (err) {
      return next(err);
    }
  },

  async removeAvatar(req, res, next) {
    try {
      if (req.user.avatar) {
        await Promise.all([
          cloudinaryUtils.deleteFile(req.user.avatar_id),
          User.update(
            { avatar: null, avatar_id: null },
            { where: { id: req.user.id } }
          ),
        ]);
      }
      return res.status(200).json({
        msg: 'Avatar removed',
      });
    } catch (err) {
      return next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { fullname, phone, currentPassword, newPassword } = req.body;

      if (!fullname && !phone && !currentPassword && !newPassword) {
        return res.status(400).json({
          status: 'bad-request',
          message: 'Please provide all the required fields.',
        });
      }

      let payload = {};

      if (fullname) {
        payload.fullname = fullname;
      }
      if (phone) {
        payload.phone = phone;
      }

      if (
        (!currentPassword && newPassword) ||
        (currentPassword && !newPassword)
      ) {
        return res.status(400).json({
          status: 'bad-request',
          message: 'Please provide both current and new password.',
        });
      }

      const user = await User.findOne({ where: { id: req.user.id } });

      if (currentPassword && newPassword) {
        const isPasswordValid = Validator.passwordChecker(newPassword);
        if (!isPasswordValid) {
          return res.status(400).json({
            status: 'bad-request',
            message:
              'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters, at least a number and a special character',
          });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
          return res.status(400).json({
            status: 'bad-request',
            message: 'Current password is incorrect.',
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        payload.password = hashedPassword;
      }

      const updatedUser = await User.update(payload, {
        where: { id: req.user.id },
      });

      return res.status(200).json({
        status: 'ok',
        message: 'Profile updated successfully.',
        data: updatedUser,
      });
    } catch (err) {
      return next(err);
    }
  },

  async sendOtp(req, res, next) {
    const { phone, fullname, password, email } = req.body;
    const country_code = phone.toString().substring(0, 3);

    if (country_code === '234') {
      const otp = Math.floor(1000 + Math.random() * 9000);

      const payload = {
        otp,
        email,
        fullname,
        phone,
        password,
      };
      await Otp.create(payload);

      const formatPhone = `0${phone.slice(phone.length - 10)}`

      SMS.sendPhoneVerificationOTP(formatPhone, otp);

      return res.created({
        message: 'please check your phone for OTP and verify your phone number',
      });
    }
    return res.ok({
      message: 'OTP not required. Not a Nigerian phone number',
    });
  },
};
