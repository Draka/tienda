module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, [
    'name',
    'slug',
    'department',
    'town',
    'primaryActivity',
  ]);
  async.auto({
    validate: (cb) => {
      body.userID = req.user._id;
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de tienda válido.' });
      }
      if (!_.trim(body.slug)) {
        body.slug = body.name;
      }
      body.slug = _.kebabCase(_.deburr(_.trim(body.slug)));
      if (global.forbidden.indexOf(body.slug) >= 0) {
        errors.push({ field: 'slug', msg: 'Slug prohibido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Store
        .countDocuments({ slug: body.slug })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'name', msg: 'Ya existe una tienda con este nombre' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (_results, cb) => {
      const store = new models.Store(body);
      store.save(cb);
    }],
    putOption: ['create', (results, cb) => {
      models.User
        .findById(req.user._id)
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          _.set(doc, 'options.storeSelect', results.create._id);
          doc.save(cb);
        });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
