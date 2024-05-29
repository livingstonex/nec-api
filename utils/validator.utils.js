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
    // console.log('Password ', password);
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

  validatePhone(n = '') {
    let firstChar;
    let number;
    const pattern = /^([0]{1})([7-9]{1})([0|1]{1})([\d]{1})([\d]{7,8})$/g;

    if (!n || n.length < 5) return false;

    if (typeof n === 'number') {
      // numbers never begin with 0, force this to become a string
      number = `0${n}`;
    } else if (typeof n === 'string') {
      firstChar = n.substring(0, 1);

      // user may supply 0 before the number or not
      // e.g 0703 or 703 (two types of people ¯\_(ツ)_/¯)
      // either way supply missing leading 0
      number = firstChar === '0' ? n : `0${n}`;
    } else {
      return false;
    }

    // remove all non-numeric characters
    return pattern.test(number.replace(/\D/g, ''));
  },
};
