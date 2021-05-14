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
    link: '/administracion/informacion-personal',
    text: 'Información Personal',
  },
  {
    link: '/administracion/informacion-personal/editar',
    text: 'Editar',
    active: true,
  },
];

module.exports = (req, res, next) => {
  query.user(req, req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/account/personal-info-edit.pug', {
      req,
      user,
      menu: 'informacion-personal',
      active: 'editar',
      breadcrumbs,
    });
  });
};
