const geolib = require('geolib');
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
    selectMethods: ['store', (results, cb) => {
      const selectMethods = [];
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No existe la tienda.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      _.each(results.store.payments, (d) => {
        const dc = _.find(global.payments, { slug: d.slug });
        if (d.active && dc) {
          selectMethods.push({
            name: dc.name,
            slug: dc.slug,
            description: dc.description,
          });
        }
      });
      cb(null, selectMethods);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send({
      paymentsMethods: results.selectMethods,
    });
  });
};
