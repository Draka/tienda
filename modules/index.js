const site = require('./site/routes');
const pages = require('./pages/routes');
const faq = require('./faq/routes');
const vendelomejor = require('./vendelomejor/routes');
const multimedia = require('./multimedia/routes');
const help = require('./help/routes');
const email = require('./email/routes');

module.exports = (app) => {
  site(app);
  pages(app);
  faq(app);
  vendelomejor(app);
  multimedia(app);
  help(app);
  email(app);
};
