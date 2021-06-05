module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    res.render('../modules/pages/views/user/register.pug', {
      req,
      title: 'Conviértete en vendedor de Santrato',
      js: 'page',
    });
  });
};
