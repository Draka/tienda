/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const site = require('./site/routes');

module.exports = (app) => {
  site(app);
};
