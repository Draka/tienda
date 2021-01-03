/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/documentos', checkAuthAdmin, require('./list'));
  app.get('/administracion/super/documentos/nuevo', checkAuthAdmin, require('./new'));
  app.get('/administracion/super/documentos/editar/:documentID([0-9a-f]{24})', checkAuthAdmin, require('./edit'));
};
