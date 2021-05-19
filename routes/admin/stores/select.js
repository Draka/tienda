module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      models.User
        .findOne({
          tenancy: req.tenancy,
          _id: req.user._id,
        })
        .exec(cb);
    },
    store: ['user', (results, cb) => {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.storeID,
        })
        .lean()
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      if (results.user.admin || (results.user.adminStore && results.store.userID === req.user._id)) {
        results.user.options.storeSelect = req.params.storeID;
        return results.user.save(cb);
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No tienes una cuenta para administrar tiendas.' }]));
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    return res.redirect(`/administracion/tiendas/${req.params.storeID}`);
  });
};
