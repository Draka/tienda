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
    'features',
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
        .findById(req.params.planID)
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
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
