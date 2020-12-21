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
        link: '/administracion/super/tiendas',
        text: 'Aprobar Tiendas',
      },
      {
        link: `/administracion/super/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/super-stores/view.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      title: 'Aprobar Tienda',
      menu: 'super-tienda',
      approve: `/administracion/super/tiendas/${req.params.storeID}/aprobar`,
      breadcrumbs,
    });
  });
};
