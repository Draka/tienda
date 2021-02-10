/* eslint-disable global-require */
const nextStatus = require('../../orders/next_status');

module.exports = (app) => {
  app.put('/v1/admin/super/orders/:orderID([0-9a-f]{24})/next-status', checkAuthAdmin, nextStatus);
  app.put('/v1/admin/super/orders/:orderID([0-9a-f]{24})/next-status/:status', checkAuthAdminStore, nextStatus);
  app.put('/v1/admin/super/orders/:orderID([0-9a-f]{24})/cancel', checkAuthAdmin, require('./cancel'));
};
