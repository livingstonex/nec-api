const { Payment, User, Plan, Subscription } =
  require('../../models/sql').models;
const Sequelize = require('sequelize');
const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET;

const payStackWebHook = async (req, res, next) => {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash == req.headers['x-paystack-signature']) {
  const hook = req.body;

  switch (hook.event) {
    case 'paymentrequest.success':
      try {
        //locate pmt reference in db
        const pmt_found = await Payment.findOne({
          where: { reference: hook.data.offline_reference },
        });

        if (!pmt_found) {
          res.send(404);
        }
        //update pmt status
        await Payment.update(
          { status: hook.data.status.toUpperCase() },
          {
            where: { reference: hook.data.offline_reference },
          }
        );
        res.send(200);
      } catch (e) {
        console.error(e);
      }

      break;
    case 'subscription.create':
      Promise.all([
        await User.findOne({
          where: { email: hook.data.customer.email },
        }),
        await Plan.findOne({
          where: {
            code: hook.data.plan.plan_code,
          },
        }),
      ])
        .then(async (result) => {
          const user = result[0];
          const plan = result[1];

          const payload = {
            subscription_code: hook.data.subscription_code,
            next_payment_date: hook.data.next_payment_date,
            amount_paid: hook.data.amount,
            active: true,
            user_id: user.id,
            plan_id: plan.id,
          };

          await Subscription.create(payload);

          await User.update(
            {
              is_paid: true,
              next_payment_date: hook.data.next_payment_date,
              plan_id: plan.id,
            },
            { where: { id: user.id } }
          );
          res.send(200);
        })
        .catch((e) => res.send(404));
      break;
    case 'subscription.disable':
      try {
        //find the user
        const user = await User.findOne({
          where: { email: hook.data.customer.email },
        });
        //use user id to locate subscription
        const sub = await Subscription.findOne({
          where: {
            [Sequelize.Op.and]: [
              { user_id: user.id },
              { active: true },
              { subscription_code: hook.data.subscription_code },
            ],
          },
        });

        if (!sub) {
          res.send(404);
        }
        await Subscription.update(
          { active: false },
          {
            where: {
              [Sequelize.Op.and]: [
                { user_id: user.id },
                { active: true },
                { subscription_code: hook.data.subscription_code },
              ],
            },
          }
        );
        res.send(200);
      } catch (e) {
        console.error(e);
      }
      break;
  }
  }
};
module.exports = payStackWebHook;
