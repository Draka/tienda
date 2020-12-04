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
    item: ['check', (results, cb) => {
      models.Place
        .findOne({
          storeID: req.params.storeID,
          _id: req.params.placeID,
        })
        .exec(cb);
    }],
    check2: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la Sede' }]));
      }
      cb();
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
        link: `/administracion/tiendas`,
        text: `Tiendas`,
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
        link: `/administracion/tiendas/${req.params.storeID}/sedes/${req.params.placeID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/places/store-places-edit.pug', {
      user: results.user,
      store: results.store,
      item: results.item,
      title: 'Editar Sede',
      menu: 'tienda-sedes',
      breadcrumbs,
      osm: true,
      js: 'admin',
    });
  });
};
