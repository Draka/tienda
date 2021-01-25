const edit = require('../controllers/super/edit');
const update = require('../controllers/api/update');
const cronStoresError = require('../controllers/cron/stores-error');
const cronProductsError = require('../controllers/cron/products-error');

module.exports = (app) => {
  app.get('/administracion/super/configuracion', checkAuthAdmin, edit);
  app.put('/v1/admin/super/config', checkAuthAdmin, update);
  app.post('/v1/admin/super/config', checkAuthAdmin, update);

  app.get('/cron/stores/error', cronStoresError);
  app.get('/cron/products/error', cronProductsError);
};
