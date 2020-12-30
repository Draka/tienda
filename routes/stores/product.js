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
      queryStore.storeBySlug(req.params.storeSlug, cb);
    },
    postFind: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      putS3LogoPath([results.store]);
      cb();
    }],
    categories: ['store', (results, cb) => {
      if (!results.store) {
        return cb(null, []);
      }
      models.Category
        .find({
          storeID: results.store._id,
          categoryID: null,
        })
        .select({
          name: 1,
          slugLong: 1,
          active: 1,
        })
        .sort({
          name: 1,
        })
        .lean()
        .exec(cb);
    }],
    product: ['store', (results, cb) => {
      queryProduct.productBySKU(results.store._id, req.params.sku, cb);
    }],
    postFindProduct: ['product', (results, cb) => {
      if (!results.store || !results.product) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe el producto' }]));
      }
      results.product.isAvailable = isAvailable(results.product);
      putS3Path([results.product], results.store);
      results.product.ldJson = _.map(results.product.imagesSizes, (i) => i.original);
      cb();
    }],
    products: ['product', (results, cb) => {
      models.Product
        .find({
          storeID: results.store._id,
          categoryIDs: { $in: _.clone(results.product.categoryIDs).reverse() },
          publish: 1,
        })
        .sort({
          updateAt: -1,
        })
        .limit(12)
        .lean()
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(results.products, results.store);
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

    res.render('pages/stores/product.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      categories: results.categories,
      product: results.product,
      products: results.products,
      title: results.product.name,
      menu: 'index',
      js: 'store',
      rating,
    });
  });
};
