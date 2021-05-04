const { getUrlPage } = require('../../../libs/query');

module.exports = (req, res, next) => {
  const body = _.pick(req.body, ['url']);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => cb(),
    getUrl: ['validate', (results, cb) => {
      getUrlPage(body.url, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    // delete results.getUrl.page;
    res.send(results.getUrl.amz);
  });
};
