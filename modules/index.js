const site = require('./site/routes');
const pages = require('./pages/routes');
const faq = require('./faq/routes');

module.exports = (app) => {
  site(app);
  pages(app);
  faq(app);
};
