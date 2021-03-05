const getName = require('../controllers/rest/page/name');
const updateProduct = require('../controllers/rest/page/update-product');

module.exports = (app) => {
  app.post('/v1/amz/name', getName);
  app.post('/v1/amz/store/:productID', updateProduct);
};
