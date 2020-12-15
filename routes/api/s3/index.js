/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/v1/build/static', require('./static'));
};
