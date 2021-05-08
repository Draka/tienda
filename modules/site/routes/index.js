const edit = require('../controllers/super/edit');
const update = require('../controllers/api/update');
const cronStoresError = require('../controllers/cron/stores-error');
const cronProductsError = require('../controllers/cron/products-error');
const cronProductsList = require('../controllers/cron/products-list');
const css = require('../controllers/api/css');

module.exports = (app) => {
  app.get('/administracion/super/configuracion', checkAuthAdmin, edit);
  app.put('/v1/admin/super/config', checkAuthAdmin, update);
  app.post('/v1/admin/super/config', checkAuthAdmin, update);

  app.get('/cron/stores/error', cronStoresError);
  app.get('/cron/products/error', cronProductsError);
  app.get('/cron/products/list', cronProductsList);

  // Crea css
  app.get('/v1/start/css', css);
  app.get('/v1/admin/super/config/css', checkAuthAdmin, css);
};
