const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  // Salta a otra url
  if (global.forbidden.indexOf(req.params.storeSlug) >= 0) {
    return next('route');
  }

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
    featuredCategories: ['categories', (results, cb) => {
      results.store.featuredCategories = results.categories.map((category) => ({ category, quantity: 10 }));
      cb();
    }],
    products: ['featuredCategories', (results, cb) => {
      const products = {};

      async.each(results.store.featuredCategories, (featured, cb) => {
        models.Product
          .find({
            storeID: results.store._id,
            categoryIDs: { $in: featured.category._id },
            publish: 1,
          })
          .sort({
            updateAt: -1,
          })
          .limit(featured.quantity)
          .exec((err, docs) => {
            if (err) {
              return cb(err);
            }
            putS3Path(docs, results.store);
            _.each(docs, (product) => {
              product.isAvailable = !((_.get(product, 'available.start') && moment.tz().isBefore(product.available.start))
            || (_.get(product, 'available.end') && moment.tz().isAfter(product.available.end)));
            });
            products[featured.category._id] = docs;
            cb();
          });
      }, (err) => {
        setImmediate(cb, err, products);
      });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    res.render('pages/stores/index.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      categories: results.categories,
      products: results.products,
      title: config.site.title,
      menu: 'index',
      js: 'store',
    });
  });
};
