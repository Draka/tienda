const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  query.user(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('admin/pages/dashboard/index.pug', { user });
  });
};
