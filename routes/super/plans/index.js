/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/planes', checkAuthAdmin, require('./list'));
  app.get('/administracion/super/planes/nuevo', checkAuthAdmin, require('./new'));
  app.get('/administracion/super/planes/editar/:planID([0-9a-f]{24})', checkAuthAdmin, require('./edit'));
  app.get('/administracion/super/planes/:planID([0-9a-f]{24})', checkAuthAdmin, require('./view'));
};
