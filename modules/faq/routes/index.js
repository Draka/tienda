const faqCategoryList = require('../controllers/super/faq-category/list');
const faqCategoryNew = require('../controllers/super/faq-category/new');
const faqCategoryEdit = require('../controllers/super/faq-category/edit');
const faqCategoryApiUpdate = require('../controllers/api/faq-category/update');
const faqCategoryApiNew = require('../controllers/api/faq-category/new');

const faqList = require('../controllers/super/faq/list');
const faqNew = require('../controllers/super/faq/new');
const faqEdit = require('../controllers/super/faq/edit');
const faqApiUpdate = require('../controllers/api/faq/update');
const faqApiNew = require('../controllers/api/faq/new');

module.exports = (app) => {
  app.get('/administracion/super/faq-categorias', checkAuthAdmin, faqCategoryList);
  app.get('/administracion/super/faq-categorias/nuevo', checkAuthAdmin, faqCategoryNew);
  app.get('/administracion/super/faq-categorias/:faqCategoryID/editar', checkAuthAdmin, faqCategoryEdit);
  app.post('/v1/admin/super/faq-categories', checkAuthAdmin, faqCategoryApiNew);
  app.put('/v1/admin/super/faq-categories/:faqCategoryID', checkAuthAdmin, faqCategoryApiUpdate);

  app.get('/administracion/super/faq', checkAuthAdmin, faqList);
  app.get('/administracion/super/faq/nuevo', checkAuthAdmin, faqNew);
  app.get('/administracion/super/faq/:faqID/editar', checkAuthAdmin, faqEdit);
  app.post('/v1/admin/super/faq', checkAuthAdmin, faqApiNew);
  app.put('/v1/admin/super/faq/:faqID', checkAuthAdmin, faqApiUpdate);
};
