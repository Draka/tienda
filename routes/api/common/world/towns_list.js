const list = require('./towns_db');

module.exports = (req, res) => {
  res.send(_.orderBy(_.filter(list, { departmentSlug: req.params.departmentSlug }), 'name'));
};
