const moment = require('moment');

// eslint-disable-next-line no-extend-native
Date.prototype.getWeekNumber = function () {
  const d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

module.exports = {
  //
  toDateString(date) {
    return moment(date).format('L');
  },

  formatDate(date, format) {
    return moment(date).format(format);
  },

  UTC(date) {
    return moment(date).utc().toISOString();
  },

  //
  formatQueryTime(date) {
    return moment(new Date(date || Date.now())).format('YYYY-MM-DD HH:mm:ss');
  },

  formatDay(date) {
    return moment(new Date(date || Date.now())).format('YYYY-MM-DD');
  },

  formatDayLocal(date) {
    return moment(new Date(date || Date.now())).format('DD/MM/YYYY');
  },

  //
  getDaysSinceTime(date) {
    return moment().diff(moment(date), 'days');
  },

  //
  add(amount, unit, date) {
    return this.formatQueryTime(moment(date).add(amount, unit));
  },

  subtract(amount, unit, date) {
    return this.add(-amount, unit, date);
  },

  minutesAgo(minutes = 0) {
    return this.formatQueryTime(moment().subtract(minutes, 'minutes'));
  },

  startOfDay(day) {
    return this.formatQueryTime(moment(day).startOf('day'));
  },

  endOfHour(day) {
    return moment(new Date(day || Date.now())).endOf('hour');
  },

  endOfDay(day) {
    return this.formatQueryTime(moment(day).endOf('day'));
  },

  startOfWeek(day) {
    return this.formatQueryTime(moment(day).startOf('week'));
  },

  endOfWeek(day) {
    return this.formatQueryTime(moment(day).endOf('week'));
  },

  startOfMonth(day) {
    return this.formatQueryTime(moment(day).startOf('month'));
  },

  endOfMonth(day) {
    return this.formatQueryTime(moment(day).endOf('month'));
  },

  startOfYear(day) {
    return this.formatQueryTime(moment(day).startOf('year'));
  },

  endOfYear(day) {
    const end = moment(day).endOf('year');
    return this.formatQueryTime(end);
  },

  isBetween(date, start, end) {
    return moment(date).isBetween(start, end, null, '[]');
  },

  //
  now() {
    return this.formatQueryTime();
  },

  timeStamp() {
    // This function is used exclusively in our DB models. DON'T USE `this`!!!
    // Use Time.now for functions that require Current TimeStamp
    return moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
  },

  diffDays(start, end) {
    start = moment(start);
    end = moment(end);
    return start.diff(end, 'days');
  },

  getDiff(start, end, format = 'days') {
    start = moment(start);
    end = moment(end);
    return end.diff(start, format);
  },

  dayOfWeek(day) {
    const DAYS = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      7: 'Sun',
    };
    return DAYS[day];
  },

  oneWeekAgo(date = new Date().setHours(0, 0, 0, 0)) {
    return moment(date).add(-7, 'days').format('YYYY-MM-DD HH:mm:ss');
  },

  formattedDate(date) {
    return `${moment(date).format('Do')} ${moment(date).format(
      'MMMM'
    )} ${moment(date).format('YYYY')}, at ${moment(date).format('h:mmA')}`;
  },

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
