const storesList = require('../controllers/rest/stores/list');

module.exports = (app) => {
  app.get('/v1/connectivity/stores', redisMiddleware, storesList);
};
