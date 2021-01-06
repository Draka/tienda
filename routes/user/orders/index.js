/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/usuario/pedidos', checkAuth, require('./list'));
  app.get('/usuario/pedidos/:orderID', checkAuth, require('./view'));
  app.get('/usuario/ordenes/cancelar-confirmacion', checkAuth, require('./cancelar-confirmacion'));
};
