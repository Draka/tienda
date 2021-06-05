module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'active',
    'publish',
    'auth',
    'breadcrumbs',
    'title',
    'slug',
    'seo',
    'html',
  ]);
  body.tenancy = req.tenancy;

  if (typeof req.body.active !== 'undefined' && !body.active) {
    body.active = false;
  }
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.title)) {
        errors.push({ field: 'title', msg: 'Escribe un nombre de Página válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Page
        .findOne({ tenancy: req.tenancy, slug: body.slug || _.kebabCase(_.deburr(body.title)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe una Página con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const page = new models.Page(body);
      page.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
