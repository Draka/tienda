const list = require('../controllers/super/list');
const superNew = require('../controllers/super/new');
const apiNew = require('../controllers/api/new');

module.exports = (app) => {
  app.get('/administracion/super/multimedia', checkAuthAdmin, list);
  app.get('/administracion/super/multimedia/nuevo', checkAuthAdmin, superNew);
  app.get('/v1/admin/super/config', checkAuthAdmin, apiNew);
};
