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
    coveragesAreas: ['check', (results, cb) => {
      query.coveragesAreas(req.params.storeID, cb);
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
        active: true,
      },
    ];

    res.render('admin/pages/stores/store-coverage-areas-list.pug', {
      user: results.user,
      store: results.store,
      items: results.coveragesAreas.map((i) => {
        let gj = JSON.stringify({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: JSON.parse(i.points),
          },
        });
        gj = `geojson(${gj})`;

        i.image = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${encodeURI(gj)}/auto/100x100@2x?logo=false&attribution=false&access_token=${config.mapbox}`;
        return i;
      }),
      title: 'Áreas de cobertura',
      menu: 'tienda-zonas-de-coberturas',
      xnew: `/administracion/tiendas/${req.params.storeID}/zonas-de-coberturas/nuevo`,
      breadcrumbs,
    });
  });
};
