/* eslint-disable global-require */
module.exports = (app) => {
  app.put('/v1/admin/orders/:orderID([0-9a-f]{24})/next-status', checkAuthAdminStore, require('./next_status'));
  app.put('/v1/admin/orders/:orderID([0-9a-f]{24})/next-status/:status', checkAuthAdminStore, require('./next_status'));
};
