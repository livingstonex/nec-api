const { Otp } = require('../models/sql').models;

module.exports = {
  async verifyOtp(req, res, next) {
    const { phone, otp } = req.body;
    try {
      const country_code = phone.toString().substring(0, 3);
      if (country_code === '234') {
        req.body.country_code = 'NG';
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
      }
      return next();
    } catch (error) {
      next(error);
    }
  },
};
