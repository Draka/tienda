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
    active: true,
  },
];

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/account/bank-account.pug', {
      user, menu: 'cuenta-bancaria', active: 'cuenta-bancaria', breadcrumbs,
    });
  });
};
