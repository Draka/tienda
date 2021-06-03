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
    link: '/usuario/informacion-personal',
    text: 'Datos personales y seguridad',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('../modules/account/view/user/personal-info.pug', {
    req,
    title: 'Datos personales y seguridad',
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
