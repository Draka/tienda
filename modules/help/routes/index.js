const helpCategoryList = require('../controllers/super/help-category/list');
const helpCategoryNew = require('../controllers/super/help-category/new');
const helpCategoryEdit = require('../controllers/super/help-category/edit');
const helpCategoryApiUpdate = require('../controllers/api/help-category/update');
const helpCategoryApiNew = require('../controllers/api/help-category/new');

const helpList = require('../controllers/super/help/list');
const helpNew = require('../controllers/super/help/new');
const helpEdit = require('../controllers/super/help/edit');
const helpApiUpdate = require('../controllers/api/help/update');
const helpApiNew = require('../controllers/api/help/new');

const landpage = require('../controllers/common/landpage');

const commonCategoryList = require('../controllers/api/common/category/list');

module.exports = (app) => {
  app.get('/administracion/super/ayuda-categorias', checkAuthAdmin, helpCategoryList);
  app.get('/administracion/super/ayuda-categorias/nuevo', checkAuthAdmin, helpCategoryNew);
  app.get('/administracion/super/ayuda-categorias/:helpCategoryID/editar', checkAuthAdmin, helpCategoryEdit);
  app.post('/v1/admin/super/help-categories', checkAuthAdmin, helpCategoryApiNew);
  app.put('/v1/admin/super/help-categories/:helpCategoryID', checkAuthAdmin, helpCategoryApiUpdate);

  app.get('/administracion/super/ayuda', checkAuthAdmin, helpList);
  app.get('/administracion/super/ayuda/nuevo', checkAuthAdmin, helpNew);
  app.get('/administracion/super/ayuda/:helpID/editar', checkAuthAdmin, helpEdit);
  app.post('/v1/admin/super/help', checkAuthAdmin, helpApiNew);
  app.put('/v1/admin/super/help/:helpID', checkAuthAdmin, helpApiUpdate);

  app.get('/ayuda', landpage);

  app.get('/v1/help/categories', commonCategoryList);
  app.get('/v1/help/categories/:categoryID', commonCategoryList);
  app.get('/v1/help/categories/:categoryID/questions', commonCategoryList);
  app.get('/v1/help/categories/:categoryID/questions/:questionID', commonCategoryList);
};
