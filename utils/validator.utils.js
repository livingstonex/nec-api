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

  passwordChecker(password) {
    console.log('Password ', password);
    const checker =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    const isValid = password.match(checker);
    return isValid;
  },

  phoneNumberChecker(phone) {
    const checkPhoneNumber =
      /(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}(?!\d)/;
    const isValid = phone.match(checkPhoneNumber);
    return isValid;
  },
};
