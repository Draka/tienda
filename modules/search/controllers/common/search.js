const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  // Salta a otra url
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
      { shortDescription: { $regex: q, $options: 'i' } },
      { categoryText: { $regex: q, $options: 'i' } },
      { brandText: { $regex: q, $options: 'i' } },
    ];
  }
  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    category: (cb) => {
      if (req.params.slugLong) {
        queryStore.categoryByLongSlug(req, req.params.slugLong, cb);
      } else {
        cb();
      }
    },
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
          select: 'name slug',
        })
        .lean()
        .limit(24)
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(req, results.products);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
    count: (cb) => {
      models.Product
        .countDocuments(query)
        .exec(cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/buscar',
        text: 'Buscar',
        active: true,
      },
    ];

    const item = {
      seo: `Encuentra ${req.query.q} en ${req.site.name}`,
    };

    res.render('../modules/search/views/common/search.pug', {
      req,
      products: results.products,
      item,
      title: `Resultado de búsqueda de ${req.query.q}`,
      q: req.query.q,
      count: results.count,
      breadcrumbs,
      js: 'store',
    });
  });
};
