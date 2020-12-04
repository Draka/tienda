/* eslint-disable global-require */
module.exports = (app) => {
  app.post('/v1/admin/stores', checkAuth, require('./new'));
  app.put('/v1/admin/stores/:storeID([0-9a-f]{24})', checkAuth, require('./update'));
  app.post('/v1/admin/stores/:storeID([0-9a-f]{24})', checkAuth, require('./update'));
};
