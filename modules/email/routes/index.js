const emailTemplateList = require('../controllers/super/templates/list');
const emailTemplateNew = require('../controllers/super/templates/new');
const emailTemplateEdit = require('../controllers/super/templates/edit');
const emailTemplateApiUpdate = require('../controllers/api/templates/update');
const emailTemplateApiNew = require('../controllers/api/templates/new');

const landpage = require('../controllers/common/landpage');
const topic = require('../controllers/common/topic');
const search = require('../controllers/common/search');

const commonCategoryList = require('../controllers/api/common/category/list');

module.exports = (app) => {
  app.get('/administracion/super/emails-plantillas', checkAuthAdmin, emailTemplateList);
  app.get('/administracion/super/emails-plantillas/nuevo', checkAuthAdmin, emailTemplateNew);
  app.get('/administracion/super/emails-plantillas/:emailTemplateID/editar', checkAuthAdmin, emailTemplateEdit);
  app.post('/v1/admin/super/emails-templates', checkAuthAdmin, emailTemplateApiNew);
  app.put('/v1/admin/super/emails-templates/:emailTemplateID', checkAuthAdmin, emailTemplateApiUpdate);

  app.get('/ayuda', landpage);
  app.get('/ayuda/topico/:slugLong', topic);
  app.get('/ayuda/buscar', search);

  app.get('/v1/email/categories', commonCategoryList);
};
