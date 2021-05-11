const search = require('../controllers/common/search');
const categories = require('../controllers/common/categories');

module.exports = (app) => {
  app.get('/buscar', search);
  app.get('/categorias', categories);
  app.get('/categorias/:slugLong', categories);
};
