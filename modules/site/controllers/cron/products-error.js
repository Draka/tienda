const { checkProduct } = require('../../libs/check-store.lib');

module.exports = (req, res, next) => {
  async.auto({
    query: (cb) => {
      models.Store
        .find()
        .exec(cb);
    },
    check: ['query', (results, cb) => {
      async.eachLimit(results.query, 10, (store, cb) => {
        async.auto({
          query: (cb) => {
            models.Product
              .find({
                storeID: store._id,
              })
              .exec(cb);
          },
          check: ['query', (results, cb) => {
            async.eachLimit(results.query, 10, (product, cb) => {
              checkProduct(store, product, cb);
            }, cb);
          }],
        }, cb);
      }, cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
