const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    }],
    selectMethods: ['store', (results, cb) => {
      let selectMethods = [];
      if (!results.store) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (_.get(req, 'site.modules.payments')) {
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
      } else {
        results.store.payments = _.clone(global.paymentsMaster);
        selectMethods = results.store.payments;
      }
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
