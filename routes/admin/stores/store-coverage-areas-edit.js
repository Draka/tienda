const { getCenterOfBounds } = require('geolib');

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
    coverageArea: ['check', (results, cb) => {
      models.CoverageArea
        .findOne({ tenancy: req.tenancy, storeID: req.params.storeID, _id: req.params.coverageAreaID })
        .exec(cb);
    }],
    check2: ['coverageArea', (results, cb) => {
      if (!results.coverageArea) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
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
        link: `/administracion/tiendas/${req.params.storeID}/zonas-de-coberturas/${req.params.coverageAreaID}/editar`,
        text: `Editar - ${results.coverageArea.name}`,
        active: true,
      },
    ];
    const points = JSON.parse(results.coverageArea.points);
    res.render('admin/pages/stores/store-coverage-areas-edit.pug', {
      req,
      user: results.user,
      store: results.store,
      item: results.coverageArea,
      center: getCenterOfBounds(points),
      title: 'Editar Área de cobertura',
      menu: 'tienda-zonas-de-coberturas',
      breadcrumbs,
      osm: 'draw',
      js: 'admin',
    });
  });
};
