module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'title',
    'alt',
  ]);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Multimedia
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.multimediaID,
        })
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'multimedias', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
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
