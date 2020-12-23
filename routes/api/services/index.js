/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/services/geocoder', redisMiddleware, require('./geocoder'));
  app.get('/v1/services/send-email', require('./send-email'));
  app.get('/v1/services/check-sqs', require('./check-sqs'));
};
