const helpCategoryList = require('../controllers/super/help-category/list');
const helpCategoryNew = require('../controllers/super/help-category/new');
const helpCategoryEdit = require('../controllers/super/help-category/edit');
const helpCategoryApiUpdate = require('../controllers/api/help-category/update');
const helpCategoryApiNew = require('../controllers/api/help-category/new');

const landpage = require('../controllers/common/landpage');
const topic = require('../controllers/common/topic');

const commonCategoryList = require('../controllers/api/common/category/list');
const commonCategoryTree = require('../controllers/api/common/category/tree');

module.exports = (app) => {
  app.get('/administracion/super/ayuda-categorias', checkAuthAdmin, helpCategoryList);
  app.get('/administracion/super/ayuda-categorias/nuevo', checkAuthAdmin, helpCategoryNew);
  app.get('/administracion/super/ayuda-categorias/:helpCategoryID/editar', checkAuthAdmin, helpCategoryEdit);
  app.post('/v1/admin/super/help-categories', checkAuthAdmin, helpCategoryApiNew);
  app.put('/v1/admin/super/help-categories/:helpCategoryID', checkAuthAdmin, helpCategoryApiUpdate);

  app.get('/ayuda', landpage);
  app.get('/ayuda/topico/:slugLong', topic);

  app.get('/v1/help/categories', commonCategoryList);
  app.get('/v1/help/tree', commonCategoryTree);
};
