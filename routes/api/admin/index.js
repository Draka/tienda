/* eslint-disable global-require */
module.exports = (app) => {
  require('./stores')(app);
  require('./coverages-areas')(app);
  require('./places')(app);
  require('./categories')(app);
  require('./products')(app);
  require('./orders')(app);
  require('./super/orders')(app);
  require('./super/pages')(app);
  require('./super/documents')(app);
  require('./super/plans')(app);
};
