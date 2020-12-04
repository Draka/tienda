module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'active',
    'name',
    'address',
    'point',
    'schedule',
  ]);
  if (req.body.point) {
    const p = req.body.point.split(',');
    body['location.type'] = 'Point';
    body['location.coordinates'] = [p[0], p[1]];
  }
  if (typeof req.body.active !== 'undefined' && !body.active) {
    body.active = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Sede válido.' });
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
    query: ['check', (_results, cb) => {
      models.Place
        .findById(req.params.placeID)
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'places', msg: 'No existe la sede.' });
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
