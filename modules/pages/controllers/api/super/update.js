module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'active',
    'publish',
    'title',
    'slug',
    'seo',
    'html',
  ]);
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
        .findById(req.params.pageID)
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      body.userID = req.user._id;
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