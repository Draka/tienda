const commonView = require('../controllers/common/view');
const commonIndex = require('../controllers/common/index');

// super admin
const superList = require('../controllers/super/list');
const superNew = require('../controllers/super/new');
const superEdit = require('../controllers/super/edit');
// api super admin
const apiSuperNew = require('../controllers/api/super/new');
const apiSuperUpdate = require('../controllers/api/super/update');

// Sistema
const systemCheck = require('../controllers/system/check');

// expone global
global.getFragment = require('../libs/fragment');

module.exports = (app) => {
  app.get('/paginas/:slug', commonView);
  app.get('/', commonIndex);

  app.get('/administracion/super/paginas', checkAuthAdmin, superList);
  app.get('/administracion/super/paginas/nuevo', checkAuthAdmin, superNew);
  app.get('/administracion/super/paginas/editar/:pageID([0-9a-f]{24})', checkAuthAdmin, superEdit);

  app.post('/v1/admin/super/pages', checkAuthAdmin, apiSuperNew);
  app.put('/v1/admin/super/pages/:pageID([0-9a-f]{24})', checkAuthAdmin, apiSuperUpdate);

  // Crea fragmentos obligados
  systemCheck();
};
