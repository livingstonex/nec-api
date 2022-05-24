const { User } = require('../../models/sql').models;
// const Error = require('../../utils/errorResponse');
const Validator = require('../../utils/validator.utils');
const sendTokenResponse = require('../../utils/sendTokenResponse.utils');
const bcrypt = require('bcryptjs');

// module.exports = Register;
module.exports = {
  async register(req, res, next) {
    try {
      const { email, fullname, phone, password } = req.body;
      if (email === '' || password ==- '' || phone === '' || fullname === '') {
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

      // const userExist = await User.findOne({ where: { email } });

      // if (userExist != null) {
      //   return res.status(400).json({
      //     status: 'failed',
      //     message: `A user with ${email} already exist`,
      //     data: '',
      //   });
      // }

      // const newUser = await User.create({
      //   fullname,
      //   password:hashedPassword,
      //   phone,
      //   email,
      // });

      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          fullname,
          password: hashedPassword,
          phone,
          email,
        },
      });
      if (created) {
        return res.status(200).json({
          status: 'success',
          message: 'User created successfully',
          data: user,
        });

        
      }else{
        return res.status(400).json({
          status:'failed',
          message: `A user with ${email} already exist`,
          data:''
        })
      }
    } catch (e) {
      return next(e);
    }
  },

  async login (req, res, next) {
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
          data: errors
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          status: 'failed',
          message: 'Invalid login details!'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({
          success: 'failed',
          message: 'Invalid login details!'
        });
      }
      user.password = undefined;
      return sendTokenResponse(user, res, 200, 'Login successful');
    } catch (e) {
      return next(e);
    }
  },

  async logout (req, res) {
    res.cookie('nec-cookie', 'none', {
      expires: new Date(Date.now() - 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({
      success: 'success',
      data: {},
      message: 'Logout successful'
    });
  },
  //==other auth controllers ==//
};
