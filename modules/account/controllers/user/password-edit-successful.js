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
  },
  {
    link: '/usuario/informacion-personal/contrasena/contrasena-cambiada',
    text: 'Mensaje',
    active: true,
  },
];

const msg = {
  color: 'action',
  title: 'Contraseña Cambiada',
  text: 'La nueva contraseña se ha guardado, la deberá usar para iniciar sesión de ahora en adelante.',
};

module.exports = (req, res) => {
  res.render('../modules/account/view/user/general.pug', {
    req,
    breadcrumbs,
    account: true,
    msg,
    js: 'user',
  });
};
