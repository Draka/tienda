/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/informacion-personal', checkAuthAdminStore, require('./personal-info'));
  app.get('/administracion/informacion-personal/editar', checkAuthAdminStore, require('./personal-info-edit'));

  app.get('/administracion/contrasena', checkAuthAdminStore, require('./password-edit'));
  app.get('/administracion/contrasena-cambiada', checkAuthAdminStore, require('./password-edit-successful'));

  app.get('/administracion/correo', checkAuthAdminStore, require('./email-edit'));
  app.get('/administracion/correo-cambiado', checkAuthAdminStore, require('./email-edit-successful'));

  app.get('/administracion/cuenta-bancaria', checkAuthAdminStore, require('./bank-account'));
  app.get('/administracion/cuenta-bancaria/editar', checkAuthAdminStore, require('./bank-account-edit'));
};
