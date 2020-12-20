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

const msg = {
  color: 'action',
  title: 'Contraseña Cambiada',
  text: 'La nueva contraseña se ha guardado, la deberá usar para iniciar sesión de ahora en adelante.',
};

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }

    res.render('admin/pages/messages/general.pug', {
      session: req.user,
      user,
      menu: 'contrasena',
      title: 'Contraseña',
      msg,
      breadcrumbs,
    });
  });
};
