const query = require('../../../libs/query.lib');
const departments = require('../../api/common/world/departments_db');
const towns = require('../../api/common/world/towns_db');

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
        link: `/administracion/tiendas/${req.params.storeID}/editar`,
        text: 'Editar',
        active: true,
      },
    ];

    res.render('admin/pages/stores/store-edit.pug', {
      req,
      user: results.user,
      store: results.store,
      title: 'Tienda',
      menu: 'tienda',
      breadcrumbs,
      cke: true,
      js: 'admin',
      departments,
      towns: _.orderBy(_.filter(towns, { departmentSlug: results.store.department }), 'name'),
      back: `/administracion/tiendas/${req.params.storeID}`,
    });
  });
};
