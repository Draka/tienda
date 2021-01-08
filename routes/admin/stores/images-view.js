const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');
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
    postFind: ['check', (results, cb) => {
      putS3LogoPath([results.store]);
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
        link: `/administracion/tiendas/${req.params.storeID}/imagenes`,
        text: 'Imágenes',
        active: true,
      },
    ];

    res.render('admin/pages/stores/images-view.pug', {
      session: req.user,
      user: results.user,
      store: results.store,
      title: 'Imágenes',
      menu: 'tienda-imagenes',
      edit: `/administracion/tiendas/${req.params.storeID}/imagenes/editar`,
      breadcrumbs,
    });
  });
};