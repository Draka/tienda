const list = require('./departments_db');

module.exports = (req, res) => {
  res.send(_.filter(list, { countryIso: req.params.countryIso }));
};
