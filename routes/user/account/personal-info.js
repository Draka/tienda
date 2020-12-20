const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario',
    text: 'Cuenta',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('pages/account/personal-info.pug', {
    session: req.user,
    user: req.user,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
