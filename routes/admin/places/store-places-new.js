const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
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
      if (results.user.admin) {
        return cb();
      }
      if (results.user.id === results.store.userID) {
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
