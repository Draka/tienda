const query = require('../../../libs/query.lib');

const breadcrumbs = [
  {
    link: '/administracion',
    text: 'Administración',
  },
  {
    text: 'Tienda',
  },
  {
    link: '/administracion/tiendas/nuevo',
    text: 'Nueva',
    active: true,
  },
];

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/stores/store-new.pug', {
      user,
      title: 'Nueva tienda',
      menu: 'tienda-nueva',
      breadcrumbs,
    });
  });
};
