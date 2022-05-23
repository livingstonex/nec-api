const { User } = require('../../models/sql').models;
const Error = require('../../utils/errorResponse');
const Validator = require('../../utils/validator.utils');
const bcrypt = require('bcryptjs');

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
  //==other auth controllers ==//
};
