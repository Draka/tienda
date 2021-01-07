const products = require('./products');
const stores = require('./stores');
const orders = require('./orders');
const world = require('./world');

module.exports = (app) => {
  products(app);
  stores(app);
  orders(app);
  world(app);
};
