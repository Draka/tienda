const list = require('../controllers/super/list');
const superNew = require('../controllers/super/new');
const superEdit = require('../controllers/super/edit');

const apiNew = require('../controllers/api/super/new');
const apiDelete = require('../controllers/api/super/delete');
const apiUpdate = require('../controllers/api/super/update');

module.exports = (app) => {
  app.get('/administracion/super/multimedia', checkAuthAdmin, list);
  app.get('/administracion/super/multimedia/nuevo', checkAuthAdmin, superNew);
  app.get('/administracion/super/multimedia/editar/:multimediaID([0-9a-f]{24})', checkAuthAdmin, superEdit);
  app.post('/v1/admin/super/multimedia', checkAuthAdmin, apiNew);
  app.delete('/v1/admin/super/multimedia/:multimediaID([0-9a-f]{24})', checkAuthAdmin, apiDelete);
  app.put('/v1/admin/super/multimedia/:multimediaID([0-9a-f]{24})', checkAuthAdmin, apiUpdate);
};
