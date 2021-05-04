module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);
  body.tenancy = req.tenancy;

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
      models.Place
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          sku: 1,
        })
        .lean()
        .exec(cb);
    }],
    count: ['check', (_results, cb) => {
      models.Place
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
        link: `/administracion/tiendas/${req.params.storeID}/sedes`,
        text: 'Sedes',
        active: true,
      },
    ];

    res.render('admin/pages/places/store-places-list.pug', {
      req,
      user: results.user,
      store: results.store,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Sedes',
      menu: 'tienda-sedes',
      xnew: `/administracion/tiendas/${req.params.storeID}/sedes/nuevo`,
      breadcrumbs,
      js: 'admin',
    });
  });
};
