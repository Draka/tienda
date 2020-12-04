/* eslint-disable global-require */
module.exports = (app) => {
  app.post('/v1/admin/stores/:storeID([0-9a-f]{24})/places', checkAuth, require('./new'));
  app.put('/v1/admin/stores/:storeID([0-9a-f]{24})/places/:placeID([0-9a-f]{24})', checkAuth, require('./update'));
};
