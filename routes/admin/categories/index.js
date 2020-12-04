/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/categorias', checkAuthAdminStore, require('./list'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/categorias/nuevo', checkAuthAdminStore, require('./new'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/categorias/:categoryID([0-9a-f]{24})/editar', checkAuthAdminStore, require('./edit'));
};
