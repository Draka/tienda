const queryStore = require('../../../../libs/query_store.lib');
const queryProduct = require('../../../../libs/query_product.lib');
const { putS3Path } = require('../../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
        return cb(listErrors(404, null, errors));
      }
      cb();
    }],
    product: ['check', (results, cb) => {
      queryProduct.productBySKU(req, results.store._id, req.params.productSKU, cb);
    }],
    postFind: ['product', (results, cb) => {
      if (!results.product) {
        errors.push({ field: 'product', msg: 'El registro no existe.' });
        return cb(listErrors(404, null, errors));
      }
      putS3Path(req, [results.product], results.store);
      results.product.store = req.params.storeSlug;
      results.product.storeName = results.store.name;
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const product = _.pick(results.product, [
      'digital.is',
      'available',
      'publish',
      'price',
      'inventory',
      'stock',
      'imagesURLs',
      'images',
      'imagesSizes',
      'categoryText',
      'featured',
      'name',
      'sku',
      'slug',
      'brandText',
      'shortDescription',
      'longDescription',
      'features',
      'storeID',
      'groups',
    ]);
    product.storeName = results.store.name;
    res.send(product);
  });
};
