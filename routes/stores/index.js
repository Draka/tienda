/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/tiendas/:storeSlug', require('./store'));
  // app.get('/buscar', require('./search'));
  // app.get('/categorias', require('./category'));
  // app.get('/categorias/:categorySlugLong', require('./category'));
  app.get('/tiendas/:storeSlug/productos/:sku', require('./product'));
};
