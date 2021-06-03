const menu = require('../controllers/user/menu');
const personalInfo = require('../controllers/user/personal-info');
const personalInfoEdit = require('../controllers/user/personal-info-edit');
const passwordEdit = require('../controllers/user/password-edit');
const passwordEditSuccessful = require('../controllers/user/password-edit-successful');
const emailEdit = require('../controllers/user/email-edit');
const emailEditSuccessful = require('../controllers/user/email-edit-successful');
const history = require('../controllers/user/history');
const logout = require('../controllers/user/logout');

const apiUpdate = require('../api/user/update');
const updatePersonalInfo = require('../api/user/update-personal-info');
const updateEmail = require('../api/user/update-email');
const updatePassword = require('../api/user/update-password');
const delHistory = require('../api/user/delete-history');

module.exports = (app) => {
  app.get('/usuario', checkAuth, menu);
  app.get('/usuario/informacion-personal', checkAuth, personalInfo);
  app.get('/usuario/informacion-personal/editar', checkAuth, personalInfoEdit);

  app.get('/usuario/informacion-personal/contrasena', checkAuth, passwordEdit);
  app.get('/usuario/informacion-personal/contrasena-cambiada', checkAuth, passwordEditSuccessful);

  app.get('/usuario/informacion-personal/correo', checkAuth, emailEdit);
  app.get('/usuario/informacion-personal/correo-cambiado', checkAuth, emailEditSuccessful);

  app.get('/usuario/historial', checkAuth, history);

  app.get('/cerrar-sesion', checkAuth, logout);

  app.put('/v1/users', checkAuth, apiUpdate);
  app.put('/v1/users/personal-info', checkAuth, updatePersonalInfo);
  app.put('/v1/users/email', checkAuth, updateEmail);
  app.put('/v1/users/password', checkAuth, updatePassword);

  app.delete('/v1/users/history/:productID', checkAuth, delHistory);
};
