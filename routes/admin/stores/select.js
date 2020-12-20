const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      models.User
        .findById(req.user._id)
        .exec(cb);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      results.user.options.storeSelect = req.params.storeID;
      results.user.save(cb);
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    return res.redirect(`/administracion/tiendas/${req.params.storeID}`);
  });
};
