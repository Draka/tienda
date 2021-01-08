const view = require('../controllers/super/view');
const edit = require('../controllers/super/edit');

module.exports = (app) => {
  app.get('/administracion/super/site', checkAuthAdmin, view);
  app.get('/administracion/super/site/edit', checkAuthAdmin, edit);
};
