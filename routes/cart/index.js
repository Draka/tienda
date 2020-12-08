/* eslint-disable global-require */
module.exports = (app) => {
  // Carrito
  app.get('/carrito', require('./cart'));
  app.get('/carrito-direccion', checkAuth, require('./cart-address'));
  app.get('/carrito-resumen', checkAuth, require('./cart-finish'));
};
