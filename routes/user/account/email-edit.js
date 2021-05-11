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
    req,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
