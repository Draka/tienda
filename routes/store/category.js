const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const categoriesUp = require('../../libs/categories_up.lib');

module.exports = (req, res, next) => {
  const query = {
    publish: 1,
    $and: [
      {
        $or: [
          { 'available.start': { $exists: false } },
          { 'available.start': null },
          { 'available.start': '' },
          { 'available.start': { $lte: new Date() } },
        ],
      },
      {
        $or: [
          { 'available.end': { $exists: false } },
          { 'available.end': null },
          { 'available.end': '' },
          { 'available.end': { $gte: new Date() } },
        ],
      },

    ],
  };
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
      query.storeID = results.store._id;
      cb();
    }],
    category: ['postFind', (results, cb) => {
      queryStore.categoryByLongSlug(results.store._id, req.params.categorySlugLong, cb);
    }],
    categoryIDs: ['category', (results, cb) => {
      if (!req.params.categorySlugLong) {
        return cb(null, []);
      }
      categoriesUp(req.params.categorySlugLong, cb);
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
    categoriesHeader: ['category', 'categories', (results, cb) => {
      if (!req.params.categorySlugLong) {
        return cb(null, results.categories);
      }
      models.Category
        .find({
          storeID: results.store._id,
          categoryID: results.category._id,
        })
        .select({
          name: 1,
          slugLong: 1,
          active: 1,
        })
        .sort({
          name: 1,
        })
        .exec(cb);
    }],
    products: ['category', (results, cb) => {
      if (results.category) {
        query.categoryIDs = results.category._id;
      }
      models.Product
        .find(query)
        .sort({
          updateAt: -1,
        })
        .limit(42)
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(results.products, results.store);
      cb();
    }],
    count: ['category', (results, cb) => {
      if (results.category) {
        query.categoryIDs = results.category._id;
      }
      models.Product
        .countDocuments(query)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    res.render('pages/stores/category.pug', {
      user: results.user,
      store: results.store,
      category: results.category,
      categories: results.categories,
      categoriesHeader: results.categoriesHeader,
      products: results.products,
      categoryIDs: results.categoryIDs,
      title: results.category ? `${results.category.name} - compra ${results.category.name}` : 'Categorías',
      count: results.count,
      menu: 'index',
      js: 'store',
    });
  });
};
