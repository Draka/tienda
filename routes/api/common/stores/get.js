const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      queryStore.storeBySlug(req.params.storeSlug, cb);
    }],
    selectStore: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No existe la tienda.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }

      cb(null, _.pick(req.body, [
        'name',
        'slug',
      ]));
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send({ store: results.selectStore });
  });
};
