/* eslint-disable global-require */
const uploadPayment = require('./upload-payment');

module.exports = (app) => {
  app.post('/v1/orders', checkAuth, require('./new'));
  app.get('/v1/orders/ref/:orderID', checkAuth, require('./reference'));
  app.post('/v1/orders/payment/:orderID([0-9a-f]{24})', checkAuth, uploadPayment);
  app.put('/v1/orders/:orderID([0-9a-f]{24})/cancel', checkAuth, require('./cancel'));
};
