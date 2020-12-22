const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      if (results.user.admin || results.user._id.toString() === results.store.userID.toString()) {
        body.storeID = req.params.storeID;
        if (req.query.q) {
          body.$or = [
            { name: { $regex: req.query.q, $options: 'i' } },
            { slugLong: { $regex: req.query.q, $options: 'i' } },
          ];
        }
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
    }],
    tree: ['check', (results, cb) => {
      query.categoryTree(req.params.storeID, cb);
    }],
    items: ['tree', (results, cb) => {
      const items = [];
      query.treePush(results.tree, items);
      cb(null, items);
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
        link: `/administracion/tiendas/${req.params.storeID}/categorias`,
        text: 'Categorías',
        active: true,
      },
    ];

    res.render('admin/pages/categories/list.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Categorías',
      menu: 'tienda-categorias',
      xnew: `/administracion/tiendas/${req.params.storeID}/categorias/nuevo`,
      breadcrumbs,
    });
  });
};
