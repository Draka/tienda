/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/usuario/pedidos', checkAuthAdminStore, require('./list'));
  app.get('/usuario/pedidos/:orderID', checkAuthAdminStore, require('./view'));
  app.get('/usuario/ordenes/cancelar-confirmacion', checkAuthAdminStore, require('./cancelar-confirmacion'));
};
