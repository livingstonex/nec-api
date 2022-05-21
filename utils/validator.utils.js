const validator = require('validator');

module.exports = {
  validator,
  validateEmail(email) {
    if (!email) return false;

    email = email.trim();

    const isValidEmail =
      email && validator.isEmail(email) && !RegExp('\\d+@nec.ng').test(email);

    return isValidEmail;
  },
};
