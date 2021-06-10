module.exports = (req, res, next) => {
  async.auto({
    store: (cb) => {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.storeID,
        })
        .exec(cb);
    },
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      results.store.publish = false;
      results.store.save(cb);
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/administracion/tiendas');
  });
};
