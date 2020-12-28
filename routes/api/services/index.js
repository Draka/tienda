/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/services/geocoder', redisMiddleware, require('./geocoder'));
  app.get('/v1/services/send-email', require('./send-email'));
  app.get('/v1/services/check-sqs', require('./check-sqs'));
  app.post('/v1/services/events/:token', require('./events'));
  app.post('/v1/services/redirect-payment/:token', require('./redirect-payment'));
};
