const search = require('../controllers/common/search');
const categories = require('../controllers/common/categories');
const groups = require('../controllers/common/groups');

module.exports = (app) => {
  app.get('/buscar', search);
  app.get('/categorias', categories);
  app.get('/categorias/:slugLong', categories);
  app.get('/grupos/:group/', groups);
  app.get('/grupos/:group/:slugLong', groups);
};
