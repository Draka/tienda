/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/:storeSlug/products/:productSKU', checkAuth, require('./get'));
};