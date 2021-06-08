const list = require('../controllers/common/list');
const search = require('../controllers/common/search');

const publishSend = require('../controllers/admin/publish');
const approveSend = require('../controllers/admin/approve');

module.exports = (app) => {
  app.get('/tiendas', list);
  app.get('/tiendas/buscar', search);

  app.get('/administracion/tiendas/:storeID/pedir-revision', approveSend);
  app.get('/administracion/tiendas/:storeID/publicar', publishSend);
};
