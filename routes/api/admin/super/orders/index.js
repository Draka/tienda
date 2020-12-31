/* eslint-disable global-require */
module.exports = (app) => {
  app.put('/v1/admin/super/orders/:orderID([0-9a-f]{24})/next-status', checkAuthAdmin, require('./next_status'));
  app.put('/v1/admin/super/orders/:orderID([0-9a-f]{24})/cancel', checkAuthAdmin, require('./cancel'));
};
