const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const query = require('../../libs/query.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const { capitalized, rating } = require('../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      if (!req.user || !req.user._id) {
        return cb();
      }
      cb(null, global.session);
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
      models.Product
        .findOne({
          storeID: results.store._id,
          sku: req.params.sku,
          publish: 1,
        })
        .populate({
          path: 'categoryIDs',
          select: 'name slugLong',
        })
        .exec(cb);
    }],
    postFindProduct: ['product', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe el producto' }]));
      }
      putS3Path([results.product], results.store);
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
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(results.products, results.store);
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    results.product.name = capitalized(_.get(results, 'product.name'));

    res.render('pages/stores/product.pug', {
      user: results.user,
      store: results.store,
      categories: results.categories,
      product: results.product,
      products: results.products,
      title: results.product.name,
      menu: 'index',
      js: 'page',
      rating,
    });
  });
};
