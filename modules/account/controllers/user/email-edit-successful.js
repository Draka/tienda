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
  },
  {
    link: '/usuario/informacion-personal/correo/correo-cambiado',
    text: 'Mensaje',
    active: true,
  },
];

const msg = {
  color: 'action',
  title: 'Correo Cambiado',
  text: 'El nuevo Correo se ha guardado, lo deberá usar para iniciar sesión de ahora en adelante.',
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
