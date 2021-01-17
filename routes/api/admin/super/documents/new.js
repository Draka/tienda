module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'publish',
    'title',
    'slug',
    'seo',
    'html',
  ]);
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.title)) {
        errors.push({ field: 'title', msg: 'Escribe un nombre de Documento válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Document
        .findOne({ slug: body.slug || _.kebabCase(_.deburr(body.title)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe un Documento con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const document = new models.Document(body);
      document.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
