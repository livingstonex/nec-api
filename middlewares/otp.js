const { Otp } = require('../models/sql').models;

module.exports = {
  async verifyOtp(req, res, next) {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.badRequest({ message: 'Please provide a valid otp or phone' });
    }

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

        await Otp.destroy({
          where: { otp, phone },
        });
      }
      return next();
    } catch (error) {
      next(error);
    }
  },
};
