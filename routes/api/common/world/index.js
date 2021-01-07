const countriesList = require('./countries_list');
const departmentsList = require('./departments_list');
const townsList = require('./towns_list');

module.exports = (app) => {
  app.get('/v1/countries', countriesList);
  app.get('/v1/departments/:countryIso', departmentsList);
  app.get('/v1/towns/:departmentSlug', townsList);
};
