module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'categoryID',
    'active',
    'order',
    'title',
    'seo',
    'text',
  ]);
  if (typeof req.body.active !== 'undefined' && !body.active) {
    body.active = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.title)) {
        errors.push({ field: 'title', msg: 'Escribe un Título válida.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Help
        .findOne({ slug: _.kebabCase(_.deburr(body.title)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe un Título con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const help = new models.Help(body);
      help.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
