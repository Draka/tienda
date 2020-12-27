/* eslint-disable global-require */

module.exports = (app) => {
  app.post('/v1/orders/cancel', checkAuth, require('./cancel'));
  app.post('/v1/orders', checkAuth, require('./new'));
  app.get('/v1/orders/id/:id', checkAuth, require('./detail'));
  app.get('/v1/orders', checkAuth, require('./list'));
};
