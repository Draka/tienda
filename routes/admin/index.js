/* eslint-disable global-require */
module.exports = (app) => {
  require('./account')(app);
  require('./stores')(app);
  require('./places')(app);
  require('./categories')(app);
  require('./products')(app);
  require('./orders')(app);
};
