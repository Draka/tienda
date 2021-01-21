const list = require('../controllers/super/list');
const superNew = require('../controllers/super/new');
const apiNew = require('../controllers/api/super/new');
const apiDelete = require('../controllers/api/super/delete');

module.exports = (app) => {
  app.get('/administracion/super/multimedia', checkAuthAdmin, list);
  app.get('/administracion/super/multimedia/nuevo', checkAuthAdmin, superNew);
  app.post('/v1/admin/super/multimedia', checkAuthAdmin, apiNew);
  app.delete('/v1/admin/super/multimedia/:multimediaID', checkAuthAdmin, apiDelete);
};
