module.exports = {
    TIMEZONE: process.env.TZ || 'Africa/Lagos',
    MINUTES: '00 * * * * *', // EVERY MINUTE
    FIVE_MINUTES: '00 */5 * * * *', // EVERY FIVE MINUTES
    THIRTY_MINUTES: '00 */30 * * * *', // EVERY 30 MINUTES
    SECONDS: '* * * * * *', // EVERY SECOND
    HOURLY: '00 * * * *', // EVERY HOUR
    DAILY: '00 19 * * *', // 7PM EVERY DAY
    TWICE_DAILY: '00 10,20 * * *', // 10AM, 8PM
    THRICE_DAILY: '00 10,14,20 * * *', // 10AM, 2PM, 8PM
    MIDNIGHT: '00 00 * * *', // EVERY DAY AT MIDNIGHT
    //
    BALANCE_CHECK_TIME: '55-59 22,23,0 * * *',
    BALANCE_CHECK_TIME_2: '0-5 23,0,1 * * *',
    //
    TWO_AM: '00 02 * * *', // 3AM EVERY DAY
    THREE_AM: '00 03 * * *', // 3AM EVERY DAY
    FOUR_AM: '00 04 * * *', // 4AM EVERY DAY
    SIX_PM: '00 18 * * *', // 6PM EVERY DAY
    FOUR_PM: '00 16 * * *', // 4PM EVERY DAY
    //
    THREE_AM_MONTHLY: '00 03 01 * *', // 3AM EVERY MONTH
    //
    THREE_AM_WEEKLY: '00 03 * * 01', // 3AM EVERY WEEK
    WEDNESDAY_TWELVE_AM: '00 00 * * 3', // 12AM EVERY WEDNESDAY
    FRIDAY_TWELVE_AM: '00 00 * * 5', // 12AM EVERY FRIDAY
    THURSDAY_TWELVE_NOON: '53 21 * * 4', // 3.30PM EVERY THURSDAY
  
    FRIDAY_FOUR_THIRTY_FIVE_PM: '35 16 * * 5', // 04.35PM EVERY FRIDAY
  
    TEN_AM: '00 10 * * *', // 10AM DAILY
    ELEVEN_AM: '00 11 * * *', // 11AM DAILY
    TWELVE_NOON: '00 12 * * *', // 12PM DAILY
    TWELVE_THIRTY_NOON: '30 12 * * *', // 12.30PM DAILY
    ONE_PM: '00 13 * * *', // 1PM DAILY
    TWO_THIRTY_PM: '30 14 * * *', // 2:30PM DAILY
    THREE_THIRTY_PM: '30 15 * * *', // 3:30PM DAILY
  
    FIVE_PM: '00 17 * * *', // 1PM DAILY
    WEEKLY: '0 0 * * 1', // 1PM DAILY
    TWENTY_FOURTH_DAY_OF_THE_MONTH: '0 0 24 * *', // 1PM DAILY
  
    RANDOM: '5 19 * * *', // 1PM DAILY
  };
  