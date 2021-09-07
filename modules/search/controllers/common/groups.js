const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');
const queryStore = require('../../../../libs/query_store.lib');
const categoriesUp = require('../../../../libs/categories_up.lib');

const groups = [
  'nuevos',
  'destacados',
  'ofertas',
  'favoritos',
];

module.exports = (req, res, next) => {
  // Salta a otra url
  let sort = {
    createdAt: -1,
  };
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
    validate: (cb) => {
      if (groups.indexOf(req.params.group) === -1) {
        return cb(listErrors(404, null, [{ field: 'group', msg: 'El registro no existe.' }]));
      }
      if (req.params.group === 'nuevos') {
        // nada
      } else if (req.params.group === 'destacados') {
        query.featured = true;
      } else if (req.params.group === 'ofertas') {
        query.$and = [
          {
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
              }],
          },
          {
            $or: [
              {
                $and: [
                  { 'offer.available.start': { $lte: new Date() } },
                  { 'offer.available.end': { $gte: new Date() } },
                ],
              },
              {
                $and: [
                  { 'offer.available.start': { $lte: new Date() } },
                  {
                    $or: [
                      { 'offer.available.end': null },
                      { 'offer.available.end': '' },
                      { 'offer.available.end': { $exists: false } },
                    ],
                  },
                ],
              },
              {
                $and: [
                  { 'offer.available.end': { $gte: new Date() } },
                  {
                    $or: [
                      { 'offer.available.start': null },
                      { 'offer.available.start': '' },
                      { 'offer.available.start': { $exists: false } },
                    ],
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      { 'offer.available.end': null },
                      { 'offer.available.end': '' },
                      { 'offer.available.end': { $exists: false } },
                    ],
                  },
                  {
                    $or: [
                      { 'offer.available.start': null },
                      { 'offer.available.start': '' },
                      { 'offer.available.start': { $exists: false } },
                    ],
                  },
                ],
              }],
          }];
        query['offer.percentage'] = { $gt: 0 };
        sort = {
          'offer.available.end': -1,
        };
      } else if (req.params.group === 'favoritos') {
        // nada
      }
      cb();
    },
    category: ['validate', (results, cb) => {
      queryStore.categoryByLongSlug(req, req.params.slugLong, cb);
    }],
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
        .sort(sort)
        .populate({
          path: 'storeID',
          select: 'name slug approve publish',
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
    count: ['category', (results, cb) => {
      models.Product
        .countDocuments(query)
        .exec(cb);
    }],
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
        link: `/grupos/${req.params.group}`,
        text: _.capitalize(req.params.group),
      },
    ];
    _.each(results.categoryIDs, (category, i) => {
      breadcrumbs.push(
        {
          link: `/grupos/${req.params.group}/${category.slugLong}`,
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

    res.render('../modules/search/views/common/groups.pug', {
      req,
      products: results.products,
      categoryIDs: results.categoryIDs,
      categoriesHeader: results.categoriesHeader,
      item,
      title: `${breadcrumbs[1].text.toUpperCase()} de ${_.last(breadcrumbs).text}`,
      q: req.query.q,
      count: results.count,
      breadcrumbs,
      js: 'store',
    });
  });
};
