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
    link: '/administracion/correo',
    text: 'Correo',
    active: true,
  },
];

const msg = {
  color: 'action',
  title: 'Correo Cambiado',
  text: 'El nuevo Correo se ha guardado, lo deberá usar para iniciar sesión de ahora en adelante.',
};

module.exports = (req, res, next) => {
  query.user(req, req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }

    res.render('admin/pages/messages/general.pug', {
      req,
      user,
      menu: 'correo',
      title: 'Correo',
      msg,
      breadcrumbs,
    });
  });
};
