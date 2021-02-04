module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, [
    'active',
    'name',
    'price',
    'points',
  ]);
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
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne({ _id: req.params.storeID, userID: req.user._id })
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      cb();
    }],
    create: ['check', (_results, cb) => {
      body.storeID = req.params.storeID;
      const coveragesAreas = new models.CoverageArea(body);
      coveragesAreas.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
