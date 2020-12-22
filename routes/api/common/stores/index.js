/* eslint-disable global-require */
module.exports = (app) => {
  app.post('/v1/:storeSlug', require('./get'));
  // app.get('/v1/services/geocoder', redisMiddleware, require('./geocoder'));
  // app.post('/v1/:storeSlug/services/find-places', redisMiddleware, require('./find_places'));
  // app.post('/v1/:storeSlug/services/check-cart', require('./check_cart'));
  app.post('/v1/:storeSlug/services/search-shipping-methods', require('./search_shipping_methods'));
  app.post('/v1/:storeSlug/services/search-payments-methods', require('./search_payments_methods'));
};
