const departments = require('../../api/common/world/departments_db');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
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
        link: '/administracion/tiendas/nuevo',
        text: 'Nueva',
        active: true,
      },
    ];

    res.render('admin/pages/stores/store-new.pug', {
      req,
      user: results.user,
      title: 'Nueva tienda',
      menu: 'tiendas',
      breadcrumbs,
      js: 'admin',
      departments,
      towns: [],
    });
  });
};
