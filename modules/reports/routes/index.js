const search = require('../controllers/super/search');

module.exports = (app) => {
  app.get('/administracion/super/reportes', checkAuthAdmin, search);
};
