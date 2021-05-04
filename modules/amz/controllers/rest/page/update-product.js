const { getUrlPage } = require('../../../libs/query');

module.exports = (req, res, next) => {
  const body = _.pick(req.body, ['url']);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => cb(),
    query: ['validate', (_results, cb) => {
      models.Product
        .findById(req.params.productID)
        .exec(cb);
    }],
    getUrl: ['validate', (results, cb) => {
      getUrlPage(req, body.url, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    // delete results.getUrl.page;
    res.send(results.getUrl.amz);
  });
};
