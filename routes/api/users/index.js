const singup = require('./singup');
const login = require('./login');
const me = require('./me');
const passwordReset = require('./password_reset');
const addresses = require('./addresses');

module.exports = (app) => {
  app.post('/v1/users', singup);
  app.post('/v1/users/login', login);
  app.get('/v1/users/me', checkAuth, me);
  app.post('/v1/users/password-reset', passwordReset);
  app.post('/v1/users/addresses', checkAuth, addresses);
};
