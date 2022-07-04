const Env = require('./env.utils');
const axios = require('axios');
const { officialPhoneNumber } = require('./verticals');
const Validator = require('./validator.utils');
const Formatter = require('./formatter.utils');
const SmsLog = require('../models/mongo/SmsLog');

module.exports = {
  SmsApi: axios.create({
    baseURL: Env.get('INFOBIP_BASE_URL') || 'https://mpv6n4.api.infobip.com',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `App ${Env.get('INFOBIP_API_KEY')}`,
    },
    timeout: 60000,
  }),

  async sendSms(phones = [], text, id, opts = {}) {
    if (!text) {
      throw new Error('Invalid SMS Text');
    }

    if (!Array.isArray(phones)) {
      phones = [phones];
    }

    const results = phones
      .map(
        (phone) =>
          new Promise((resolve, reject) => {
            if (Env.live) {
              // Log SMS to console in Dev
              console.log(
                `*** SMS ***
Phone: ${phone}

${text}
************`
              );
              return resolve();
            }

            // Banned Phone Numbers here
            const banned = [
              '08066001345',
              '08107710021',
              '07033386123',
              '08037071568',
            ];

            if (banned.includes(phone)) {
              return;
            }

            try {
              if (!Validator.validatePhone(phone)) {
                SmsLog.create({
                  data: {
                    message: `Invalid Phone Number: ${phone}`,
                    phone,
                    text,
                    ref: id,
                  },
                }).catch((e) => e);

                throw new Error(`Invalid Phone Number: ${phone}`);
              }

              const ref = phones.length > 1 || !id ? Date.now() : id;
              const postData = {
                messages: [
                  {
                    from: 'NEC',
                    destinations: [
                      {
                        to: Formatter.formatSmsPhone(phone),
                        messageId: ref,
                      },
                    ],
                    flash: false,
                    intermediateReport: true,
                    notifyUrl:
                      Env.get('INFOBIP_CALLBACK_URL') ||
                      'http://localhost:7001/webhook/sms',
                    notifyContentType: 'application/json',
                    callbackData: ref,
                    text,
                  },
                ],
              };

              if (opts.link) {
                // SMS w/ URL, Add Infobip URL flag (for URL shortening)
                postData.tracking = {
                  track: 'URL',
                  type: opts.type || 'SMS_LINK',
                };
              }

              // Send Request
              this.SmsApi.post('/sms/2/text/advanced', postData)
                .then((res) => {
                  // console.log('Inner res: ', res);
                  SmsLog.create({
                    data: {
                      ...res.data,
                      phone,
                      text,
                      ref,
                    },
                  }).catch(console.error);
                  return resolve();
                })
                .catch((err) => {
                  if (err.response) {
                    SmsLog.create({
                      data: {
                        ...err.response.data,
                        phone,
                        text,
                        ref,
                      },
                    }).catch(console.error);
                  }
                  reject(err);
                });
            } catch (err) {
              return reject(err);
            }
          })
      )
      .map((r) => r.then(() => true).catch(() => false));

    if (results.every((r) => r)) {
      return 'All SMS Sent Successfully!';
    }

    throw new Error('SMS not sent.');
  },

  async sendPhoneVerificationOTP(phone, otp) {
    const text = `Please use this OTP to verify your phone number: ${otp} \n\nCall us on ${officialPhoneNumber} if you have any issue.`;

    return this.sendSms(phone, text, null, {
      type: 'PHONE_VERIFICATION_OTP',
    }).catch((error) => {
      SmsLog.create({
        data: {
          delivered: false,
          text,
          recipient: phone,
          error: JSON.stringify(error),
        },
      });
    });
  },
};
