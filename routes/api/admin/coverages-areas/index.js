/* eslint-disable global-require */
module.exports = (app) => {
  app.post('/v1/admin/stores/:storeID([0-9a-f]{24})/coverages-areas', checkAuth, require('./new'));
  app.put('/v1/admin/stores/:storeID([0-9a-f]{24})/coverages-areas/:coverageAreaID([0-9a-f]{24})', checkAuth, require('./update'));
  app.delete('/v1/admin/stores/:storeID([0-9a-f]{24})/coverages-areas/:coverageAreaID([0-9a-f]{24})', checkAuth, require('./delete'));
};
