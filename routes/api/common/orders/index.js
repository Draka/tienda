/* eslint-disable global-require */

module.exports = (app) => {
  app.post('/v1/orders', checkAuth, require('./new'));
  app.get('/v1/orders/ref/:orderID', checkAuth, require('./reference'));
  app.put('/v1/orders/:orderID([0-9a-f]{24})/cancel', checkAuth, require('./cancel'));
};
