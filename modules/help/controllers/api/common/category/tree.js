const { categoryTree } = require('../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    query: ['validate', (results, cb) => {
      categoryTree(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results.query);
  });
};
