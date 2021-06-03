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
  },
  {
    link: '/usuario/informacion-personal/correo',
    text: 'Correo',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('../modules/account/view/user/email-edit.pug', {
    req,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
