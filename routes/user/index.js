/* eslint-disable global-require */
module.exports = (app) => {
  require('./account')(app);
  require('./orders')(app);
};
