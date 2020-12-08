/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/usuario', checkAuth, require('./personal-info'));
  app.get('/usuario/editar', checkAuth, require('./personal-info-edit'));

  app.get('/usuario/contrasena', checkAuth, require('./password-edit'));
  app.get('/usuario/contrasena-cambiada', checkAuth, require('./password-edit-successful'));

  app.get('/usuario/correo', checkAuth, require('./email-edit'));
  app.get('/usuario/correo-cambiado', checkAuth, require('./email-edit-successful'));
};
