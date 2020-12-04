const fs = require('fs');
const pug = require('pug');

const ses = new AWS.SES({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: 'us-east-1',
  // apiVersion: '2010-12-01'
});

const site = config.email;

function template(data) {
  const fn = pug.compile(fs.readFileSync(`./templates/${data.template}.pug`));
  const html = fn(data);
  return html;
}
module.exports = (data, user, cb) => {
  const params = {
    Destination: { /* required */
      ToAddresses: [
        `${_.deburr(_.get(data, 'to.name') || '')}<${_.get(data, 'to.email')}>`
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: template(data)
        },
        Text: {
          Charset: 'UTF-8',
          Data: template(data).replace(/(<([^>]+)>)/ig, '')
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject
      }
    },
    // Source: `${_.get(data, 'from.name') || site.title}<${site.emailInfo}>`, /* required */
    Source: `${site.title}<${site.emailInfo}>`, /* required */
    ReplyToAddresses: [
      site.emailNoreply
    ],
  };
  async.auto({
    send: (cb) => {
      const sendPromise = ses.sendEmail(params).promise();
      sendPromise.then(
        (data) => {
          cb(null, data);
        }
      ).catch(cb);
    },
    register: ['send', (results, cb) => {
      const mail = new models.Mail({
        userID: user._id,
        template: data.template,
        subject: data.subject,
        email: _.get(data, 'to.email'),
        s3: results.send
      });
      mail.save(cb);
    }]
  }, cb);
};
