/* eslint-disable global-require */
module.exports = (app) => {
  require('./stores')(app);
  require('./orders')(app);
  require('./users')(app);
  require('./pages')(app);
  require('./documents')(app);
  require('./plans')(app);
};
