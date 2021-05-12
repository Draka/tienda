const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const { isAvailable } = require('../../libs/util.lib');

module.exports = (req, res, next) => {
  // Salta a otra url
  if (global.forbidden.indexOf(req.params.storeSlug) >= 0) {
    return next('route');
  }

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
  // si hay una busqueda
  if (req.query.q) {
    const q = _.deburr(_.trim(req.query.q));
    query.$or = [
      { slug: { $regex: q, $options: 'i' } },
      { categoryText: { $regex: q, $options: 'i' } },
      { brandText: { $regex: q, $options: 'i' } },
    ];
  }
  async.auto({
    user: (cb) => {
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
      query.storeID = results.store._id;
      cb();
    }],
    categories: ['postFind', (results, cb) => {
      models.Category
        .find({
          tenancy: req.tenancy,
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
    products: ['postFind', (results, cb) => {
      models.Product
        .find(query)
        .sort({
          updatedAt: -1,
        })
        .limit(42)
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(req, results.products, results.store);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
    count: ['postFind', (_results, cb) => {
      models.Product
        .countDocuments(query)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const item = {
      seo: `Encuentra ${req.query.q} en ${results.store.name}. ${results.store.slogan}`,
    };

    res.render('pages/stores/search.pug', {
      req,
      store: results.store,
      categories: results.categories,
      products: results.products,
      item,
      title: `Resultado de búsqueda de ${req.query.q}`,
      q: req.query.q,
      count: results.count,
      menu: 'index',
      js: 'store',
    });
  });
};
