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
    link: '/administracion/cuenta-bancaria',
    text: 'Cuenta bancaria',
  },
  {
    link: '/administracion/cuenta-bancaria/editar',
    text: 'Editar',
    active: true,
  },
];

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/account/bank-account-edit.pug', {
      user, menu: 'cuenta-bancaria', active: 'editar', breadcrumbs,
    });
  });
};
