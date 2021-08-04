const personalInfo = require('./personal-info');
const personalInfoEdit = require('./personal-info-edit');
const passwordEdit = require('./password-edit');
const passwordEditSuccessful = require('./password-edit-successful');
const emailEdit = require('./email-edit');
const emailEditSuccessful = require('./email-edit-successful');
const history = require('./history');

module.exports = (app) => {
  app.get('/usuario', checkAuth, personalInfo);
  app.get('/usuario/informacion-personal', checkAuth, personalInfo);
  app.get('/usuario/informacion-personal/editar', checkAuth, personalInfoEdit);

  app.get('/usuario/informacion-personal/contrasena', checkAuth, passwordEdit);
  app.get('/usuario/informacion-personal/contrasena-cambiada', checkAuth, passwordEditSuccessful);

  app.get('/usuario/informacion-personal/correo', checkAuth, emailEdit);
  app.get('/usuario/informacion-personal/correo-cambiado', checkAuth, emailEditSuccessful);

  app.get('/usuario/historial', checkAuth, history);
};
