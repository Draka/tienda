/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/sedes', checkAuthAdminStore, require('./store-places-list'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/sedes/nuevo', checkAuthAdminStore, require('./store-places-new'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/sedes/:placeID([0-9a-f]{24})/editar', checkAuthAdminStore, require('./store-places-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/mapa', checkAuthAdminStore, require('./store-places-map'));
};
