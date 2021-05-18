const singup = require('./singup');
const update = require('./update');
const updatePersonalInfo = require('./update-personal-info');
const updateEmail = require('./update-email');
const bankAccount = require('./bank-account');
const updatePassword = require('./update-password');
const login = require('./login');
const me = require('./me');
const passwordReset = require('./password_reset');
const addresses = require('./addresses');

module.exports = (app) => {
  app.post('/v1/users', singup);
  app.put('/v1/users', checkAuth, update);
  app.put('/v1/users/personal-info', checkAuth, updatePersonalInfo);
  app.put('/v1/users/email', checkAuth, bankAccount);
  app.post('/v1/users/bank-account', checkAuth, updateEmail);
  app.put('/v1/users/password', checkAuth, updatePassword);
  app.post('/v1/users/login', login);
  app.get('/v1/users/me', checkAuth, me);
  app.post('/v1/users/password-reset', passwordReset);
  app.post('/v1/users/addresses', checkAuth, addresses);
};
