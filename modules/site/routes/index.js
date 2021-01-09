const edit = require('../controllers/super/edit');
const update = require('../controllers/api/update');

module.exports = (app) => {
  app.get('/administracion/super/configuracion', checkAuthAdmin, edit);
  app.put('/v1/admin/super/config', checkAuthAdmin, update);
};
