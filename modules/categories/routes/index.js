const categoryList = require('../controllers/super/list');
const categoryNew = require('../controllers/super/new');
const categoryEdit = require('../controllers/super/edit');

const categoryApiUpdate = require('../controllers/api/update');
const categoryApiNew = require('../controllers/api/new');
const categoryApiDelete = require('../controllers/api/delete');

module.exports = (app) => {
  app.get('/administracion/super/categorias', checkAuthAdmin, categoryList);
  app.get('/administracion/super/categorias/nuevo', checkAuthAdmin, categoryNew);
  app.get('/administracion/super/categorias/:categoryID/editar', checkAuthAdmin, categoryEdit);

  app.post('/v1/admin/super/categories', checkAuthAdmin, categoryApiNew);
  app.put('/v1/admin/super/categories/:categoryID', checkAuthAdmin, categoryApiUpdate);
  app.delete('/v1/admin/super/categories/:categoryID', checkAuthAdmin, categoryApiDelete);
};
