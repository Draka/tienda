const mailer = require('../../../../../libs/mailer');

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
    'replyToAddresses',
  ]);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.EmailTemplate
        .findOne({
          tenancy: req.tenancy,
          _id: req.body.template,
        })
        .exec(cb);
    }],
    send: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'template', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      async.map(body.emails.split(','), (email, cb) => {
        email = _.trim(email);
        if (!email) {
          return cb();
        }
        // Une los datos del body
        const data = _.merge({
          replyToAddresses: body.replyToAddresses,
          tenancy: req.tenancy,
          template: results.query.slug,
          v: appCnf.v,
        }, _.clone(JSON.parse(body.data)));

        async.auto({
          user: (cb) => {
            if (body.test) {
              data.to = {
                name: 'Prueba',
                email,
              };
              return cb();
            }
            models.User
              .findOne({
                tenancy: req.tenancy,
                email,
              })
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
          send: ['user', (_results, cb) => {
            mailer(data, cb);
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
