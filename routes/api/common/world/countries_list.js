const list = require('./countries_db');

module.exports = (req, res) => {
  res.send(list);
};
