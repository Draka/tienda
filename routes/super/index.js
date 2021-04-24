/* eslint-disable global-require */
module.exports = (app) => {
  require('./stores')(app);
  require('./orders')(app);
  require('./users')(app);
  require('./documents')(app);
  require('./plans')(app);
};
