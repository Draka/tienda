/* eslint-disable global-require */

module.exports = (app) => {
  app.post('/v1/orders', checkAuth, require('./new'));
  app.get('/v1/orders/ref/:orderID', checkAuth, require('./reference'));
  app.post('/v1/orders/cancel', checkAuth, require('./cancel'));
};
