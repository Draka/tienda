module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });

  const body = _.pick(fbody, [
    'site',
    'name',
    'title',
    'description',
    'url',
    'email',
    'contacts',
    'images',
    'sameAs',
  ]);

  if (body.contacts) {
    body.contacts = _.map(global.socialMedia, (contact) => {
      const d = _.find(body.contacts, { slug: contact[0] });
      if (contact[3].cellphone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

        if (d.value && !re.test(d.value)) {
          errors.push({ field: 'cellphone', msg: __('Debe escribir un número de célular válido') });
        }
        if (d.value.length === 10) {
          d.value = `+57${d.value}`;
        }
        if (d.value.length === 12) {
          d.value = `+${d.value}`;
        }
      }
      return {
        slug: contact[0],
        value: _.get(d, 'value') || '',
      };
    });
  }
  async.auto({
    validate: (cb) => {
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Site
        .findOne()
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        const site = new models.Site(body);
        site.save(cb);
      } else {
        results.query.set(body).save(cb);
      }
    }],
  }, (err, results) => {
    appCnf.site = results.save;
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
