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
      if (results.user.admin || req.user.adminStore) {
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
        link: `/administracion/tiendas/${req.params.storeID}/editar`,
        text: 'Editar',
        active: true,
      },
    ];

    res.render('admin/pages/stores/store-edit.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      title: 'Tienda',
      menu: 'tienda',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
