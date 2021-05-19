const inlineCss = require('inline-css');
const fs = require('fs');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'order',
    'name',
    'slug',
    'description',
    'text',
    'subject',
  ]);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Plantilla válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.EmailTemplate
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.emailTemplateID,
        })
        .exec(cb);
    }],
    toHTML: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: '_id', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      const options = {
        url: req.urlSite,
        applyTableAttributes: true,
        removeHtmlSelectors: true,
      };
      // open layout
      fs.readFile('./modules/email/views/hbs/layout.hbs', 'utf8', (err, data) => {
        if (err) {
          return cb(err);
        }
        const text = data
          .replace('{{%urlStatic%}}', appCnf.url.cdn)
          .replace('{{%tenancy%}}', req.tenancy)
          .replace('{{%v%}}', appCnf.v)
          .replace('{{%content%}}', body.text);

        inlineCss(text, options)
          .then(
            (html) => cb(null, html),
            (err) => cb(err),
          );
      });
    }],
    save: ['toHTML', (results, cb) => {
      body.html = results.toHTML;
      results.query.set(body).save(cb);
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
