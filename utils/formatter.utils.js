const numeral = require('numeral');

module.exports = {
  formatSmsPhone(phone) {
    phone = this.formatNumber(phone);
    return `234${phone.slice(phone.length - 10)}`;
  },

  commaNumber(amount = 0) {
    const n = numeral(amount).value();
    return n ? n.toLocaleString('en-US') : '0.00';
  },

  formatAmount(num = 0) {
    return `₦${this.commaNumber(num || 0)}`;
  },

  formatAmountSafe(amount = 0) {
    return numeral(amount).value() || 0;
  },

  formatNaira(amount = 0 /* , space = true */) {
    return `₦${numeral(amount).format('0,0')}`;
  },

  formatApiErrorResponse(error) {
    return {
      error: true,
      responseCode: 20,
      message: error.message || error.responseMessage || 'An Error occured',
    };
  },

  capitalize(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  formatNumber(num = '') {
    return num;
    // return String(num).replace(/\D/g, '');
  },
};
