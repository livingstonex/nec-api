const mandrill = require('mandrill-api');
// const axios = require('axios');
const ejs = require('ejs');
const path = require('path');
const Env = require('./env.utils');

const TEMPLATES = {
  newUserSignUp: {
    subject: 'Welcome to the National Export and Import Councill Ecosystem!',
    name: 'new-user-signup',
  },
};

const mandrill_client = new mandrill.Mandrill(Env.get('MANDRILL_API_KEY'));

// Mandrill Request
// const MANDRILLAPI = axios.create({
//   baseURL: 'https://mandrillapp.com/api/1.0',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   timeout: 60000,
// });

// const getHTMLBody = (templateName = '', templateData = {}) => {
//   templateName = path.join(__dirname, `../mails/${templateName}/body.ejs`);

//   // Generate Template
//   return new Promise((resolve, reject) => {
//     ejs.renderFile(templateName, templateData, (err, str) => {
//       if (err) return reject(err);

//       return resolve(str);
//     });
//   });
// };

module.exports = {
  async sendMail({
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
      console.log('Email Error: ', error);
    }
  },
};
