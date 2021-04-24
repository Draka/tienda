/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/paginas', checkAuthAdmin, require('./list'));
  app.get('/administracion/super/paginas/nuevo', checkAuthAdmin, require('./new'));
  app.get('/administracion/super/paginas/editar/:pageID([0-9a-f]{24})', checkAuthAdmin, require('./edit'));
};
