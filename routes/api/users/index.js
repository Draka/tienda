/* eslint-disable global-require */

module.exports = (app) => {
  app.post('/v1/users', require('./singup'));
  app.put('/v1/users', checkAuth, require('./update'));
  app.put('/v1/users/personal-info', checkAuth, require('./update-personal-info'));
  app.put('/v1/users/email', checkAuth, require('./update-email'));
  app.post('/v1/users/bank-account', checkAuth, require('./bank-account'));
  app.put('/v1/users/password', checkAuth, require('./update-password'));
  app.post('/v1/users/login', require('./login'));
  app.get('/v1/users/me', checkAuth, require('./me'));
  app.post('/v1/users/password-reset', require('./password_reset'));
  app.post('/v1/users/addresses', checkAuth, require('./addresses'));
};
