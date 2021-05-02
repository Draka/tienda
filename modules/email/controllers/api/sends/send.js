const Handlebars = require('handlebars');
// const fs = require('fs');
const mailer = require('../../../../../libs/mailer');
const { model } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'template',
    'test',
    'emails',
    'data',
  ]);
  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.EmailTemplate
        .findById(req.body.template)
        .exec(cb);
    }],
    send: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'template', msg: 'No existe la Plantilla.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      const template = Handlebars.compile(results.query.html);
      async.map(body.emails.split(','), (email, cb) => {
        email = _.trim(email);
        if (!email) {
          return cb();
        }
        const data = {
          subject: results.query.subject,
          source: {
            name: _.get(appCnf, 'site.email.title'),
            email: _.get(appCnf, 'site.email.emailInfo'),
          },
          replyToAddresses: [
            _.get(appCnf, 'site.email.emailNoreply'),
          ],
          site: {
            name: _.get(appCnf, 'site.name'),
            urlSite: appCnf.url.site,
            urlStatic: appCnf.url.cdn,
            info: _.get(appCnf, 'site.email.emailInfo'),
            title: _.get(appCnf, 'site.email.title'),
            color: _.get(appCnf, 'site.color'),
            logoEmail: _.get(appCnf, 'site.images.logoEmail.jpg'),
          },
          tenancy: req.tenancy,
          v: appCnf.v,
        };
        async.auto({
          user: (cb) => {
            if (body.test) {
              data.to = {
                name: 'Prueba',
                email,
              };
              return cb();
            }
            model.User
              .findOne({ email })
              .exec((err, doc) => {
                if (err || !doc) {
                  return cb(err);
                }
                data.to = {
                  name: (_.get(doc, 'personalInfo.name') || '').split(',')[0],
                  email,
                };
                return cb(null, doc);
              });
          },
          template: ['user', (results, cb) => cb('', template(data))],
          send: ['template', (results, cb) => {
            // fs.writeFile('./public/email.html', results.template, (cb));
            mailer(data, results.user, results.template, cb);
          }],
        }, cb);
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
