/* eslint-disable global-require */
module.exports = (app) => {
  require('./stores')(app);
  require('./orders')(app);
};
