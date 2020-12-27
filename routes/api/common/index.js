/* eslint-disable global-require */
module.exports = (app) => {
  require('./products')(app);
  require('./stores')(app);
  require('./orders')(app);
};
