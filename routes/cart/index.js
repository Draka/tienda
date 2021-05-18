/* eslint-disable global-require */
const cartAddress = require('./cart-address');
const cartFinish = require('./cart-finish');

module.exports = (app) => {
  // Carrito
  app.get('/carrito', require('./cart'));
  app.get('/carrito-direccion', checkAuth, cartAddress);
  app.get('/carrito-resumen', checkAuth, cartFinish);
};
