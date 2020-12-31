/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/super/tiendas/pedidos', checkAuthAdmin, require('./list'));
  app.get('/administracion/super/tiendas/pedidos/:orderID', checkAuthAdmin, require('./view'));
};
