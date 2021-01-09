const pug = require('pug');
const utf8 = require('utf8');

const ses = new AWS.SES({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
  region: 'us-east-1',
});

function template(data, tenancy) {
  const fn = pug.compileFile(`./views/tenancy/${tenancy || appCnf.tenancy}/email/${data.template}.pug`, {});
  const html = fn(data);
  return html;
}
module.exports = (data, userID, tenancy, cb) => {
  data.tenancy = tenancy;
  const html = template(data);
  const params = {
    Destination: { /* required */
      ToAddresses: [
        `${utf8.encode(_.get(data, 'to.name') || '')}<${_.get(data, 'to.email')}>`,
      ],
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
        Text: {
          Charset: 'UTF-8',
          Data: html.replace(/(<([^>]+)>)/ig, ''),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `${data.subject} - ${data.site.title}`,
      },
    },
    // Source: `${_.get(data, 'from.name') || site.title}<${site.emailInfo}>`, /* required */
    Source: `${utf8.encode(_.get(data, 'source.name') || '')}<${_.get(data, 'source.email')}>`, /* required */
    ReplyToAddresses: data.replyToAddresses,
  };
  async.auto({
    send: (cb) => {
      const sendPromise = ses.sendEmail(params).promise();
      sendPromise.then(
        (data) => {
          cb(null, data);
        },
      ).catch(cb);
    },
    register: ['send', (results, cb) => {
      const mail = new models.Mail({
        userID,
        template: data.template,
        subject: data.subject,
        email: _.get(data, 'to.email'),
        s3: results.send,
      });
      mail.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      const mail = new models.Mail({
        userID,
        template: data.template,
        subject: data.subject,
        email: _.get(data, 'to.email'),
        s3: err,
        error: true,
      });
      mail.save(cb);
    }
    cb(null, results);
  });
};
