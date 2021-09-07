/* eslint-disable global-require */
const uploadPayment = require('./upload-payment');
const transfair = require('./2transfair');
const confirm2Transfair = require('./confirm-2transfair');

module.exports = (app) => {
  app.post('/v1/orders', checkAuth, require('./new'));
  app.get('/v1/orders/ref/:orderID', checkAuth, require('./reference'));
  app.post('/v1/orders/payment/:orderID([0-9a-f]{24})', checkAuth, uploadPayment);
  app.get('/v1/orders/2transfair/:orderID([0-9a-f]{24})', checkAuth, transfair);
  app.all('/v1/orders/confirm/:orderID([0-9a-f]{24})', confirm2Transfair);
  app.put('/v1/orders/:orderID([0-9a-f]{24})/cancel', checkAuth, require('./cancel'));
};
