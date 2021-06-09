const query = require('../../libs/query.lib');
const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    history: (cb) => {
      query.userHistory(req, req.user._id, cb);
    },
    postFindProducts: ['history', (results, cb) => {
      if (!results.history) {
        return cb();
      }
      const products = results.history.productIDs.map((i) => _.pick(i.productID, [
        '_id',
        'name',
        'price',
        'images',
        'storeID',
        'sku',
        'offer',
      ]));
      putS3Path(req, products);
      _.each(products, (product) => {
        product.isAvailable = isAvailable(product);
        product.truncate = _.truncate(product.name, { length: 30, separator: ' ' });
      });
      cb(null, products);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(_.get(results, 'postFindProducts') || []);
  });
};
