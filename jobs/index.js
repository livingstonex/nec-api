const { CronJob } = require('cron');
const Time = require('./time');
const Jobs = require('./jobs');

const createJob = (time, fn, init = false) =>
  new CronJob({
    cronTime: time,
    onTick: fn,
    start: true,
    timezone: Time.TIMEZONE,
    runOnInit: init,
  });

module.exports = {
  deactivatePayment: createJob(Time.THREE_AM, Jobs.checkPaymentValidity),
};
