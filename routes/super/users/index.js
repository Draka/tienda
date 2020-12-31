/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/usuarios', checkAuthAdmin, require('./list'));
  app.get('/administracion/super/usuarios/:userID', checkAuthAdmin, require('./view'));
};
