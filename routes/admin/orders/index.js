/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/tiendas/pedidos', checkAuthAdminStore, require('./list'));
  app.get('/administracion/tiendas/pedidos/:orderID', checkAuthAdminStore, require('./view'));
};
