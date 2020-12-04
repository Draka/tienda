const query = require('../../../libs/query.lib');
const { putS3Path } = require('../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    user: (cb) => {
      cb(null, global.session);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      if (results.user.admin || results.user.id === results.store.userID) {
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
      putS3Path(results.items, results.store);
      cb();
    }],
    count: ['check', (_results, cb) => {
      models.Product
        .countDocuments(body)
        .exec(cb);
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
      user: results.user,
      store: results.store,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Productos',
      menu: 'tienda-productos',
      xnew: `/administracion/tiendas/${req.params.storeID}/productos/nuevo`,
      breadcrumbs,
    });
  });
};
