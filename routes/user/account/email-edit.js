const query = require('../../../libs/query.lib');

const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario/correo',
    text: 'Correo',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('pages/account/email-edit.pug', {
    session: req.user,
    user: req.user,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
