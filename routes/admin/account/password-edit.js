const query = require('../../../libs/query.lib');

const breadcrumbs = [
  {
    link: '/administracion',
    text: 'Administración',
  },
  {
    text: 'Cuenta',
  },
  {
    link: '/administracion/contrasena',
    text: 'Contraseña',
    active: true,
  },
];

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/account/password-edit.pug', {
      session: req.user,
      user,
      menu: 'contrasena',
      active: 'editar',
      breadcrumbs,
    });
  });
};
