/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/services/geocoder', redisMiddleware, require('./geocoder'));
};
