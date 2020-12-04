/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/administracion', require('./dashboard'));
  require('./account')(app);
  require('./stores')(app);
  require('./places')(app);
  require('./categories')(app);
  require('./products')(app);
};
