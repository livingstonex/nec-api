const { User, Otp } = require('../models/sql').models;

module.exports = {
  async verifyOtp(req, res, next) {
    const { phone, otp } = req.body;
    try {
      const found_otp = await Otp.findOne({
        where: {
          otp,
          phone,
        },
      });
      if (!found_otp) {
        return res.badRequest({
          message: 'Invalid OTP provided',
        });
      }
      return next();
    } catch (error) {
      next(error);
    }
  },
};
