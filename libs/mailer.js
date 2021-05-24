const Handlebars = require('handlebars');
const utf8 = require('utf8');
const { htmlToText } = require('html-to-text');

const ses = new AWS.SES({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
  region: 'us-east-1',
});

module.exports = (data, cb) => {
  const errors = [];

  async.auto({
    query: (cb) => {
      models.EmailTemplate
        .findOne({
          tenancy: data.tenancy,
          slug: data.template,
        })
        .lean()
        .exec(cb);
    },
    site: (cb) => {
      models.Site
        .findOne({
          tenancy: data.tenancy,
        })
        .lean()
        .exec(cb);
    },
    template: ['query', 'site', (results, cb) => {
      if (!results.query) {
        errors.push({ field: data.template, msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }

      const template = Handlebars.compile(results.query.html);
      data.source = {
        name: _.get(results, 'site.email.title') || 'Correo Santrato',
        email: _.get(results, 'site.email.emailInfo') || 'no-reply@santrato.com',
      };
      data.replyToAddresses = [
        data.replyToAddresses || _.get(results, 'site.email.emailNoreply') || 'no-reply@santrato.com',
      ];
      data.site = {
        name: _.get(results, 'site.name'),
        urlSite: _.get(results, 'site.url'),
        urlStatic: appCnf.url.cdn,
        folder: appCnf.s3.folder,
        info: _.get(results, 'site.email.emailInfo'),
        title: _.get(results, 'site.email.title'),
        color: _.get(results, 'site.style.emailColor'),
        logoEmail: _.get(results, 'site.images.logoEmail.jpg'),
      };
      data.v = appCnf.v;
      results.site.html = template(data);

      const subject = Handlebars.compile(results.query.subject);
      data.subject = `${subject(data)} - ${_.get(results, 'site.name')}`;

      const params = {
        Destination: { /* required */
          ToAddresses: [
            `${utf8.encode((_.get(data, 'to.name') || ' ').split(' ')[0])}<${_.get(data, 'to.email')}>`,
          ],
        },
        Message: { /* required */
          Body: { /* required */
            Html: {
              Charset: 'UTF-8',
              Data: results.site.html,
            },
            Text: {
              Charset: 'UTF-8',
              Data: htmlToText(results.site.html, {
                wordwrap: 130,
              }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: data.subject,
          },
        },
        // Source: `${_.get(data, 'from.name') || site.title}<${site.emailInfo}>`, /* required */
        Source: `${utf8.encode(data.source.name)}<${data.source.email}>`, /* required */
        ReplyToAddresses: data.replyToAddresses,
      };
      cb(null, params);
    }],
    send: ['template', (results, cb) => {
      const sendPromise = ses.sendEmail(results.template).promise();
      sendPromise.then(
        (data) => {
          cb(null, data);
        },
      ).catch(cb);
    }],
    register: ['send', (results, cb) => {
      const mail = new models.Email({
        tenancy: data.tenancy,
        userID: data.userID,
        template: data.template,
        subject: data.subject,
        email: _.get(data, 'to.email'),
        s3: results.send,
      });
      mail.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      const mail = new models.Email({
        tenancy: data.tenancy,
        userID: data.userID,
        template: data.template,
        subject: data.subject,
        email: _.get(data, 'to.email'),
        s3: err,
        error: true,
      });
      mail.save(cb);
    } else {
      cb(null, results);
    }
  });
};
