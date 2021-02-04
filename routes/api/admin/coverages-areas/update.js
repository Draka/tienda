module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, [
    'active',
    'name',
    'price',
    'points',
  ]);
  const adminQuery = {
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      try {
        JSON.parse(body.points);
      } catch (error) {
        errors.push({ field: 'points', msg: 'Área no válida' });
      }
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de tienda válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (req.user.admin) {
        delete adminQuery.userID;
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne(adminQuery)
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      cb();
    }],
    query: ['check', (_results, cb) => {
      models.CoverageArea
        .findById(req.params.coverageAreaID)
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'coverages-areas', msg: 'No existe la zona de cobertura.' });
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
    res.status(201).send(results.save);
  });
};
