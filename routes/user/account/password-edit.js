const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario/contrasena',
    text: 'Contraseña',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('pages/account/password-edit.pug', {
    req,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
