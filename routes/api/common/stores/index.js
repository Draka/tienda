const getStore = require('./get');
const checkCart = require('./check_cart');
const searchShippingMethods = require('./search_shipping_methods');
const searchPaymentsMethods = require('./search_payments_methods');

module.exports = (app) => {
  app.post('/v1/stores/:storeSlug', getStore);
  // app.get('/v1/services/geocoder', redisMiddleware, require('./geocoder'));
  // app.post('/v1/:storeSlug/services/find-places', redisMiddleware, require('./find_places'));
  app.post('/v1/stores/:storeSlug/services/check-cart', checkCart);
  app.post('/v1/stores/:storeSlug/services/search-shipping-methods', searchShippingMethods);
  app.post('/v1/stores/:storeSlug/services/search-payments-methods', searchPaymentsMethods);
};
