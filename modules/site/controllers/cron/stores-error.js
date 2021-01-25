const { checkStore } = require('../../libs/check-store.lib');

module.exports = (req, res, next) => {
  async.auto({
    query: (cb) => {
      models.Store
        .find()
        .exec(cb);
    },
    check: ['query', (results, cb) => {
      async.eachLimit(results.query, 10, (store, cb) => {
        checkStore(store, cb);
      }, cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
