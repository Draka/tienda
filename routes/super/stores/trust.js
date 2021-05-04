module.exports = (req, res, next) => {
  async.auto({
    store: (cb) => {
      models.Store
        .findById(req.params.storeID)
        .exec(cb);
    },
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      results.store.trust = true;
      results.store.save(cb);
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/administracion/super/tiendas');
  });
};
