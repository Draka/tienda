const site = require('./site/routes');
const pages = require('./pages/routes');
const faq = require('./faq/routes');
const vendelomejor = require('./vendelomejor/routes');
const multimedia = require('./multimedia/routes');

module.exports = (app) => {
  site(app);
  pages(app);
  faq(app);
  vendelomejor(app);
  multimedia(app);
};
