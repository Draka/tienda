/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion/tiendas', checkAuthAdminStore, require('./store'));
  app.get('/administracion/tiendas/nuevo', checkAuthAdminStore, require('./store-new'));
  app.get('/administracion/tiendas/creado', checkAuthAdminStore, require('./store-new-created'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})', checkAuthAdminStore, require('./store-view'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/seleccionar', checkAuthAdminStore, require('./select'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/editar', checkAuthAdminStore, require('./store-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/logo', checkAuthAdminStore, require('./store-logo-view'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/logo/editar', checkAuthAdminStore, require('./store-logo-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/redes-sociales', checkAuthAdminStore, require('./store-social-media-view'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/redes-sociales/editar', checkAuthAdminStore, require('./store-social-media-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/zonas-de-coberturas', checkAuthAdminStore, require('./store-coverage-areas-list'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/zonas-de-coberturas/nuevo', checkAuthAdminStore, require('./store-coverage-areas-new'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/zonas-de-coberturas/:coverageAreaID([0-9a-f]{24})/editar', checkAuthAdminStore, require('./store-coverage-areas-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/opciones-de-entrega', checkAuthAdminStore, require('./delivery-options'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/opciones-de-entrega/editar', checkAuthAdminStore, require('./delivery-options-edit'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/opciones-de-pago', checkAuthAdminStore, require('./payment-options'));
  app.get('/administracion/tiendas/:storeID([0-9a-f]{24})/opciones-de-pago/editar', checkAuthAdminStore, require('./payment-options-edit'));
};
