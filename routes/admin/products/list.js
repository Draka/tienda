const query = require('../../../libs/query.lib');
const { putS3Path } = require('../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  let body = _.pick(req.query, ['name', 'categoryIDs']);
  body = _.pickBy(body, (o) => o);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    store: ['user', (results, cb) => {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.storeID,
        })
        .lean()
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      if (results.user.admin || results.user._id.toString() === results.store.userID.toString()) {
        body.storeID = req.params.storeID;
        if (req.query.q) {
          body.$or = [
            { sku: { $regex: req.query.q, $options: 'i' } },
            { slug: { $regex: req.query.q, $options: 'i' } },
            { categoryText: { $regex: req.query.q, $options: 'i' } },
            { brandText: { $regex: req.query.q, $options: 'i' } },
          ];
        }
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
    }],
    items: ['check', (results, cb) => {
      models.Product
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          sku: 1,
        })
        .lean()
        .exec(cb);
    }],
    postFind: ['items', (results, cb) => {
      putS3Path(req, results.items);
      cb();
    }],
    count: ['check', (_results, cb) => {
      models.Product
        .countDocuments(body)
        .exec(cb);
    }],
    tree: ['store', (results, cb) => {
      // TODO: cuando se pueda configurar para que se pueda tener sus propias categorías
      query.categoryTreeTenancy(req, cb);
    }],
    categories: ['tree', (results, cb) => {
      const items = [];
      query.treePush(results.tree, items);
      cb(null, items);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/tiendas',
        text: 'Tiendas',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/productos`,
        text: 'Productos',
        active: true,
      },
    ];

    res.render('admin/pages/products/list.pug', {
      req,
      user: results.user,
      store: results.store,
      items: results.items,
      categories: results.categories,
      limit,
      page,
      count: results.count,
      q: req.query,
      title: 'Productos',
      menu: 'tienda-productos',
      xnewProduct: `/administracion/tiendas/${req.params.storeID}/productos/nuevo`,
      breadcrumbs,
      js: 'admin',
    });
  });
};
