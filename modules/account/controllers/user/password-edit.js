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
    link: '/usuario/informacion-personal/contrasena',
    text: 'Contraseña',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('../modules/account/view/user/password-edit.pug', {
    req,
    breadcrumbs,
    account: true,
    js: 'user',
  });
};
