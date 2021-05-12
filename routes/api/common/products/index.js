/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/stores/:storeSlug/products/:productSKU', require('./get'));
};
