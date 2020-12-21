/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/:storeSlug', require('./store'));
  app.get('/:storeSlug/buscar', require('./search'));
  app.get('/:storeSlug/categorias', require('./category'));
  app.get('/:storeSlug/categorias/:categorySlugLong', require('./category'));
  app.get('/:storeSlug/productos/:sku', require('./product'));
};
