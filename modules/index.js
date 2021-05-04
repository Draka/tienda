const site = require('./site/routes');
const pages = require('./pages/routes');
const faq = require('./faq/routes');
const multimedia = require('./multimedia/routes');
const help = require('./help/routes');
const email = require('./email/routes');
const amz = require('./amz/routes');
const stores = require('./stores/routes');
const categories = require('./categories/routes');

module.exports = (app) => {
  site(app);
  pages(app);
  faq(app);
  multimedia(app);
  help(app);
  email(app);
  amz(app);
  stores(app);
  categories(app);
};
