/* eslint-disable global-require */
module.exports = (app) => {
  app.post('/v1/admin/super/documents', checkAuthAdmin, require('./new'));
  app.put('/v1/admin/super/documents/:documentID([0-9a-f]{24})', checkAuthAdmin, require('./update'));
};
