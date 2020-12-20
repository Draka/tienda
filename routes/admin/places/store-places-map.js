const { getCenterOfBounds } = require('geolib');

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
        link: `/administracion/tiendas`,
        text: `Tiendas`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/mapa`,
        text: 'Mapa',
        active: true,
      },
    ];
    const markers = results.items.map((i) => i.location.coordinates);
    let center = '';
    if (markers.length) {
      center = getCenterOfBounds(markers.map((p) => ({
        latitude: p[1], longitude: p[0],
      })));
    }

    res.render('admin/pages/places/store-places-map.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      markers,
      center,
      title: 'Mapa de Sedes',
      menu: 'tienda-mapa',
      breadcrumbs,
      osm: true,
      js: 'admin',
    });
  });
};
