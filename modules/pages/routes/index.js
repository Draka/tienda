const view = require('../controllers/common/view');

module.exports = (app) => {
  app.get('/paginas/:slug', view);
};
