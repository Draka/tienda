const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');
const queryStore = require('../../../../libs/query_store.lib');
const categoriesUp = require('../../../../libs/categories_up.lib');

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
      queryStore.categoryByLongSlug(req, req.params.slugLong, cb);
    },
    categoryIDs: ['category', (results, cb) => {
      if (!req.params.slugLong) {
        return cb(null, []);
      }
      categoriesUp(req, req.params.slugLong, cb);
    }],
    products: ['category', (results, cb) => {
      if (!results.category && req.params.slugLong) {
        return cb(listErrors(404, null, [{ field: 'category', msg: 'El registro no existe.' }]));
      }
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
    categoriesHeader: ['category', (results, cb) => {
      if (!req.params.slugLong) {
        return cb(null, req.categories);
      }
      models.Category
        .find({
          tenancy: req.tenancy,
          categoryID: results.category._id,
        })
        .select('name slugLong')
        .sort({
          name: 1,
        })
        .exec(cb);
    }],
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
        link: '/categorias',
        text: 'Categorías',
      },
    ];
    _.each(results.categoryIDs, (category, i) => {
      breadcrumbs.push(
        {
          link: `/categorias/${category.slugLong}`,
          text: category.name,
          active: i + 1 === results.categoryIDs.length,
        },
      );
    });

    const item = {
      seo: results.category
        ? `Encuentra ${results.category.name} en ${req.site.name}`
        : `Encuentra los mejores productos en ${req.site.name}`,
    };

    res.render('../modules/search/views/common/categories.pug', {
      req,
      products: results.products,
      categoryIDs: results.categoryIDs,
      categoriesHeader: results.categoriesHeader,
      item,
      title: `Resultado de búsqueda de ${req.query.q}`,
      q: req.query.q,
      count: results.count,
      breadcrumbs,
      js: 'store',
    });
  });
};
