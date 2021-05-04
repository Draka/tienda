const generateCSS = require('../../libs/generate-css.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    generateCSS: (cb) => {
      generateCSS(req, cb);
    },
  }, (err) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send({ ok: true });
  });
};
