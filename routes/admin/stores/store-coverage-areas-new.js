const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
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
        link: `/administracion/tiendas/${req.params.storeID}/zonas-de-coberturas`,
        text: 'Zonas de Coberturas',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/zonas-de-coberturas/nuevo`,
        text: 'Nueva',
        active: true,
      },
    ];

    res.render('admin/pages/stores/store-coverage-areas-new.pug', {
      req,
      user: results.user,
      store: results.store,
      items: results.coveragesAreas,
      title: 'Nueva Área de cobertura',
      menu: 'tienda-zonas-de-coberturas',
      breadcrumbs,
      osm: 'draw',
      js: 'admin',
    });
  });
};
