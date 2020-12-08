const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');

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
  // si hay una busqueda
  if (req.query.q) {
    req.query.q = _.deburr(_.trim(req.query.q));
    query.$or = [
      { slug: { $regex: req.query.q, $options: 'i' } },
      { categoryText: { $regex: req.query.q, $options: 'i' } },
      { brandText: { $regex: req.query.q, $options: 'i' } },
    ];
  }
  async.auto({
    user: (cb) => {
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
    categories: ['postFind', (results, cb) => {
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
    products: ['postFind', (results, cb) => {
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
    count: ['postFind', (_results, cb) => {
      models.Product
        .countDocuments(query)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    res.render('pages/stores/search.pug', {
      store: results.store,
      categories: results.categories,
      products: results.products,
      title: `Resultado de búsqueda de ${req.query.q}`,
      q: req.query.q,
      count: results.count,
      menu: 'index',
      js: 'store',
    });
  });
};
