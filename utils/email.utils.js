const mandrill = require('mandrill-api');
const Mailgun = require('mailgun-js');
// const axios = require('axios');
const ejs = require('ejs');
const path = require('path');
const Env = require('./env.utils');
const Validator = require('./validator.utils');
const Config = require('./config.utils');

const TEMPLATES = {
  newUserSignUp: {
    subject: 'Welcome to the National Export and Import Councill Ecosystem!',
    name: 'new-user-signup',
  },
};

// Initialize mandrill client
const mandrill_client = new mandrill.Mandrill(Env.get('MANDRILL_API_KEY'));
// Initialize mailgun
const mg = Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Mandrill Request
// const MANDRILLAPI = axios.create({
//   baseURL: 'https://mandrillapp.com/api/1.0',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   timeout: 60000,
// });

const getHTMLBody = (templateName = '', templateData = {}) => {
  templateName = path.join(__dirname, `../mails/${templateName}/body.ejs`);

  // Generate Template
  return new Promise((resolve, reject) => {
    ejs.renderFile(templateName, templateData, (err, str) => {
      if (err) return reject(err);

      return resolve(str);
    });
  });
};

module.exports = {
  async sendEmailTemplate({
    to = [],
    templateName = '',
    templateData = {},
    subject = 'NEC',
    opts = {},
  }) {
    try {
      const invalidRecipients = [];
      const MAIL_PROVIDER = (await Config.get('MAIL_PROVIDER')) || 'MAILGUN';

      to = to.filter(async (recipient) => {
        const isValidEmail = Validator.validateEmail(recipient.email);

        if (!isValidEmail) invalidRecipients.push(recipient);

        return isValidEmail;
      });

      if (!templateName || to.length < 1)
        throw new Error('Invalid email parameters');

      const html = await getHTMLBody(templateName, templateData);

      if (MAIL_PROVIDER === 'MAILGUN') {
        console.log('sending....');
        return this.sendViaMailgun({
          html,
          subject,
          to: to.map((t) => t.email).join(','),
          tags: [templateName],
          opts,
        })
          .then((res) => {
            console.log('Mail Response: ', res);
          })
          .catch((err) => {
            console.error('Mailgun Err: ', err);
          });
      }

      return this.sendViaMailgun({
        html,
        subject,
        to: to.map((t) => t.email).join(','),
        tags: [templateName],
        opts,
      });
    } catch (error) {
      throw Error(
        error.message ||
          'Error sending email. Contact NEC support on 09011111111'
      );
    }
  },

  async sendViaMailgun({
    to = '',
    html,
    from = 'NEC.NG <no-reply@nec.ng>',
    subject = 'NEC',
    tags = [],
    opts = {},
  }) {
    return new Promise((resolve, reject) => {
      const data = {
        from,
        to,
        subject,
        html,
        'o:tag': tags,
        ...opts,
      };

      mg.messages().send(data, (err, body) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(body);
        return resolve(body);
      });
    });
  },

  async sendViaMadrillClient({
    users,
    from = {
      name: 'NEC.NG',
      email: 'no-reply@nec.ng',
    },
    subject = null,
    content = [],
    template = 'newUserSignUp',
  }) {
    try {
      if (!Env.live) {
        console.log('**** MAIL SENT ****');
        return true;
      }

      if (!users) {
        return false;
      }

      if (users && !users.length) {
        users = [users];
      }

      const mailTemplate = TEMPLATES[template];

      const to = users
        .filter((user) => !!user.email.trim())
        .map((user) => ({
          email: user.email,
          name: user.name || user.phone,
          type: 'to',
        }));

      if ((Array.isArray(to) && !to.length) || !to) {
        return false;
      }

      const message = {
        subject: subject || mailTemplate.subject,
        from_email: from.email,
        to,
        headers: {
          'Reply-To': from.email,
        },
        important: true,
        global_merge_vars: content,
        message,
      };

      return await mandrill_client.messages.sendTemplate({
        template_name: mailTemplate.name,
        template_content: content,
        message,
      });
    } catch (error) {
      console.log('MadrillClient Email Error: ', error);
    }
  },
};
