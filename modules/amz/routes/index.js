const getName = require('../controllers/rest/page/name');

module.exports = (app) => {
  app.post('/v1/amz/name', getName);
};
