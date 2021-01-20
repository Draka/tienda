const view = require('../controllers/common/view');
const index = require('../controllers/common/index');

module.exports = (app) => {
  app.get('/paginas/:slug', view);
  app.get('/', index);
};
