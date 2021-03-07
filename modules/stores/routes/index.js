const list = require('../controllers/common/list');
const search = require('../controllers/common/search');

module.exports = (app) => {
  app.get('/tiendas', list);
  app.get('/tiendas/buscar', search);
};
