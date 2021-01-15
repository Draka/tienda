const site = require('./site/routes');
const pages = require('./pages/routes');

module.exports = (app) => {
  site(app);
  pages(app);
};
