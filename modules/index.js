const site = require('./site/routes');
const pages = require('./pages/routes');
const faq = require('./faq/routes');
const multimedia = require('./multimedia/routes');
const help = require('./help/routes');
const email = require('./email/routes');
const amz = require('./amz/routes');
const stores = require('./stores/routes');
const categories = require('./categories/routes');
const search = require('./search/routes');
const account = require('./account/routes');
const reports = require('./reports/routes');

module.exports = (app) => {
  site(app);
  pages(app);
  faq(app);
  multimedia(app);
  help(app);
  email(app);
  stores(app);
  categories(app);
  search(app);
  account(app);
  reports(app);
  if (process.env.NODE_ENV !== 'production') {
    amz(app);
  }
};
