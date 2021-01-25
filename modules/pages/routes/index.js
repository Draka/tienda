const view = require('../controllers/common/view');
const index = require('../controllers/common/index');

module.exports = (app) => {
  app.get('/paginas/:slug', global.cacheHtml, view);
  app.get('/', global.cacheHtml, index);
};
