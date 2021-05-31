const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const queryProduct = require('../../libs/query_product.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const { capitalized, rating } = require('../../libs/util.lib');
const { isAvailable } = require('../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      if (!req.user || !req.user._id) {
        return cb();
      }
      cb(null, req.user);
    },
    store: (cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    },
    postFind: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      putS3LogoPath(req, [results.store]);
      cb();
    }],
    product: ['postFind', (results, cb) => {
      queryProduct.productBySKU(req, results.store._id, req.params.sku, cb);
    }],
    postFindProduct: ['product', (results, cb) => {
      if (!results.store || !results.product) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      results.product.isAvailable = isAvailable(results.product);
      putS3Path(req, [results.product]);
      results.product.ldJson = _.map(results.product.imagesSizes, (i) => i.original);
      cb();
    }],
    products: ['product', (results, cb) => {
      models.Product
        .find({
          tenancy: req.tenancy,
          // storeID: results.store._id,
          categoryIDs: { $in: _.clone(results.product.categoryIDs).reverse() },
          publish: 1,
        })
        .sort({
          updatedAt: -1,
        })
        .populate({
          path: 'storeID',
          select: 'name slug approve publish',
        })
        .limit(4)
        .lean()
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(req, results.products);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    results.product.name = capitalized(_.get(results, 'product.name'));
    const item = {
      seo: results.product.shortDescription || `${results.product.name} ${global.formatMoney(results.product.price)} en ${results.store.name}`,
    };

    res.render('pages/stores/product.pug', {
      req,
      store: results.store,
      // categories: results.categories,
      product: results.product,
      products: results.products,
      item,
      title: `${results.product.name} en ${results.store.name}`,
      menu: 'index',
      js: 'store',
      rating,
    });
  });
};
