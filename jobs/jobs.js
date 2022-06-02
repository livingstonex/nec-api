const { Subscription } = require('../models/sql').models;
const moment = require('moment');
const Email = require('../utils/email.utils');

module.exports = {
  async checkPaymentValidity() {
    let todayDate = moment(new Date()).format('YYYY-MM-DD hh:mm');

    const subscriptions = await Subscription.findAll();

    if (subscriptions.length) {
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];

        let subscriptionDueDate = moment(subscription.next_payment_date).format(
          'YYYY-MM-DD hh:mm'
        );

        if (todayDate === subscriptionDueDate) {
          const data = {
            active: false,
          };

          await Subscription.update(data, {
            where: {
              id: subscription.id,
              user_id: subscription.user_id,
              subscription_code: subscription.subscription_code,
            },
          });

          const templateData = {
            name: subscription?.user?.fullname,
            email: subscription?.user?.email,
            phone: subscription?.user?.phone,
            next_payment_date: subscription?.user?.next_payment_date,
          };

          const user_email = subscription?.user.email;
          const user_fullname = subscription?.user.fullname;

          Email.sendEmailTemplate({
            to: [
              { email: user_email, name: user_fullname },
              { email: 'livooz71@gmail.com', name: 'Daniel Livingstone' },
            ],
            templateName: 'user-subscription-deactivated',
            templateData,
            subject: 'NEC: User payment status deactivated.',
          }).catch(console.error);
        }
      }
    }
  },
};
