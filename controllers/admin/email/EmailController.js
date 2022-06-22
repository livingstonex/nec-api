const Email = require('../../../utils/email.utils');

module.exports = {
  async send(req, res, next) {
    const { email, subject, message } = req.body;

    if (!email) {
      return res.badRequest({ message: 'Please provide a subject' });
    }

    if (!subject) {
      return res.badRequest({ message: 'Please provide a subject' });
    }

    if (!message) {
      return res.badRequest({ message: 'Please provide a message' });
    }

    try {
      const data = {
        message,
      };

      Email.sendEmailTemplate({
        to: [{ email }],
        templateName: 'miscellaneous-email',
        templateData: data,
        subject: `NEC: ${subject}`,
      }).catch(console.error());

      return res.ok({ message: 'Email sent.' });
    } catch (error) {
      return next(error);
    }
  },
};
