const storesList = require('../controllers/rest/stores/list');

module.exports = (app) => {
  app.post('/v1/connectivity/stores', redisMiddleware, storesList);
};
