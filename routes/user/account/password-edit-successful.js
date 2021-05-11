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

const msg = {
  color: 'action',
  title: 'Contraseña Cambiada',
  text: 'La nueva contraseña se ha guardado, la deberá usar para iniciar sesión de ahora en adelante.',
};

module.exports = (req, res) => {
  res.render('pages/messages/general.pug', {
    req,
    breadcrumbs,
    account: true,
    msg,
    js: 'user',
  });
};
