const moment = require('moment');

module.exports = {
  calculateNextPayment(chargeType, normalDate) {
    let currentDate;

    if (!chargeType) {
      return null;
    }
    currentDate = moment(normalDate);

    if (chargeType === 'weekly') {
      currentDate.add(7, 'days').format('YYYY-MM-DD hh:mm');
    } else if (chargeType === 'monthly') {
      currentDate.add(30, 'days').format('YYYY-MM-DD hh:mm');
    }

    return currentDate;
  },
};
