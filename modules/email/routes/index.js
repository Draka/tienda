const emailTemplateList = require('../controllers/super/templates/list');
const emailTemplateNew = require('../controllers/super/templates/new');
const emailTemplateEdit = require('../controllers/super/templates/edit');
const emailTemplateView = require('../controllers/super/templates/view');
const emailTemplateApiUpdate = require('../controllers/api/templates/update');
const emailTemplateApiNew = require('../controllers/api/templates/new');
const emailSends = require('../controllers/api/sends/send');

const emailSend = require('../controllers/super/send/new');

const landpage = require('../controllers/common/landpage');
const topic = require('../controllers/common/topic');
const search = require('../controllers/common/search');

const commonCategoryList = require('../controllers/api/common/category/list');

module.exports = (app) => {
  app.get('/administracion/super/emails-plantillas', checkAuthAdmin, emailTemplateList);
  app.get('/administracion/super/emails-plantillas/nuevo', checkAuthAdmin, emailTemplateNew);
  app.get('/administracion/super/emails-plantillas/:emailTemplateID/editar', checkAuthAdmin, emailTemplateEdit);
  app.get('/administracion/super/emails-plantillas/:emailTemplateID/ver', checkAuthAdmin, emailTemplateView);
  app.post('/v1/admin/super/emails-templates', checkAuthAdmin, emailTemplateApiNew);
  app.put('/v1/admin/super/emails-templates/:emailTemplateID', checkAuthAdmin, emailTemplateApiUpdate);

  app.get('/administracion/super/emails-enviar', checkAuthAdmin, emailSend);
  app.post('/v1/admin/super/emails-sends', checkAuthAdmin, emailSends);

  app.get('/ayuda', landpage);
  app.get('/ayuda/topico/:slugLong', topic);
  app.get('/ayuda/buscar', search);

  app.get('/v1/email/categories', commonCategoryList);
};
