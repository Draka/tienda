/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/productos', checkAuthAdminStore, require('./list'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/productos/nuevo', checkAuthAdminStore, require('./new'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/productos/:productID([0-9a-f]{24})/editar', checkAuthAdminStore, require('./edit'));
};
