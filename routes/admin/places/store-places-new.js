module.exports = (req, res, next) => {
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
      if (results.user.admin) {
        return cb();
      }
      if (results.user._id.toString() === results.store.userID.toString()) {
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
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
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/sedes/nuevo`,
        text: 'Nueva',
        active: true,
      },
    ];

    res.render('admin/pages/places/store-places-new.pug', {
      req,
      user: results.user,
      store: results.store,
      items: results.coveragesAreas,
      title: 'Nueva Sede',
      menu: 'tienda-sedes',
      breadcrumbs,
      osm: true,
      js: 'admin',
    });
  });
};
