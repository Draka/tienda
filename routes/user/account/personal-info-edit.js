const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario',
    text: 'Cuenta',
  },
  {
    link: '/usuario/editar',
    text: 'Editar',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('pages/account/personal-info-edit.pug', {
    session: req.user,
    user: req.user,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};