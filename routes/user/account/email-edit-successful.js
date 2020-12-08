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

const msg = {
  color: 'action',
  title: 'Correo Cambiado',
  text: 'El nuevo Correo se ha guardado, lo deberá usar para iniciar sesión de ahora en adelante.',
};

module.exports = (req, res) => {
  res.render('pages/messages/general.pug', {
    user: global.session,
    breadcrumbs,
    account: true,
    msg,
    js: 'user',
  });
};
