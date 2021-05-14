const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const categoriesUp = require('../../libs/categories_up.lib');
const { isAvailable } = require('../../libs/util.lib');

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
      cb(null, req.user);
    },
    category: (cb) => {
      queryStore.categoryByLongSlug(req, req.params.categorySlugLong, cb);
    },
    categoryIDs: ['category', (results, cb) => {
      if (!req.params.categorySlugLong) {
        return cb(null, []);
      }
      categoriesUp(req, req.params.categorySlugLong, cb);
    }],
    categories: (cb) => {
      models.Category
        .find({
          tenancy: req.tenancy,
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
    },
    categoriesHeader: ['category', 'categories', (results, cb) => {
      if (!req.params.categorySlugLong) {
        return cb(null, results.categories);
      }
      models.Category
        .find({
          tenancy: req.tenancy,
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
          updatedAt: -1,
        })
        .populate({
          path: 'storeID',
          select: 'name slug approve publish',
        })
        .lean()
        .limit(42)
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(req, results.products);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
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

    const item = {
      seo: results.category
        ? `Encuentra ${results.category.name} en ${req.site.name}`
        : `Encuentra los mejores productos en ${req.site.name}`,
    };

    res.render('pages/stores/category.pug', {
      req,
      user: results.user,
      category: results.category,
      categories: results.categories,
      categoriesHeader: results.categoriesHeader,
      products: results.products,
      categoryIDs: results.categoryIDs,
      item,
      title: results.category ? `${results.category.name} - compra ${results.category.name}` : 'Categorías',
      count: results.count,
      menu: 'index',
      js: 'store',
    });
  });
};
