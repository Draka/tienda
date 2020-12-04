/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/tiendas', checkAuthAdmin, require('./store'));
  app.get('/administracion/super/tiendas/:storeID([0-9a-f]{24})', checkAuthAdmin, require('./view'));
  app.get('/administracion/super/tiendas/:storeID([0-9a-f]{24})/aprobar', checkAuthAdmin, require('./approve'));
};
