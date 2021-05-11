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
    req,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
