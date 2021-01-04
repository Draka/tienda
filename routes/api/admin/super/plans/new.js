module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'publish',
    'name',
    'description',
    'price',
    'tax',
    'test',
    'period',
  ]);
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Plan válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Plan
        .findOne({ slug: body.slug || _.kebabCase(_.deburr(body.name)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe un Plan con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const plan = new models.Plan(body);
      plan.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
