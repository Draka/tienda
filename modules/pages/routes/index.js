const view = require('../controllers/common/view');
const index = require('../controllers/common/index');

module.exports = (app) => {
  app.get('/paginas/:slug', redisMiddleware, view);
  app.get('/', redisMiddleware, index);
};
