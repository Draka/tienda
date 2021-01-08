const view = require('./view');
const edit = require('./edit');

module.exports = (app) => {
  app.get('/administracion/super/site', checkAuthAdmin, view);
  app.get('/administracion/super/site/edit', checkAuthAdmin, edit);
};
