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

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/account/email-edit.pug', {
      req,
      user, menu: 'correo', active: 'editar', breadcrumbs,
    });
  });
};
