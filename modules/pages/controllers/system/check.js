const modCnf = require('../../modCnf');

function check(req, slug, pDefault, cb) {
  if (!_.isFunction(cb)) {
    cb = () => {};
  }
  pDefault = pDefault || {};
  models.Page
    .findOne({
      tenancy: req.tenancy,
      slug,
      tenancy: req.tenancy,
    })
    .lean()
    .exec((err, doc) => {
      if (err) {
        return cb(err);
      }
      if (!doc) {
        const page = new models.Page({
          tenancy: req.tenancy,
          active: true,
          publish: pDefault.publish || false,
          title: slug || '',
          slug: slug || '',
          seo: pDefault.seo || '',
          html: pDefault.html || '',
        });
        page.save(cb);
      } else {
        cb();
      }
    });
}

module.exports = (req, res, next) => {
  async.parallel([
    (cb) => {
      check(req, 'index', { html: modCnf.index, publish: true }, cb);
    },
    (cb) => {
      check(req, 'menu', { html: modCnf.menu, publish: false }, cb);
    },
    (cb) => {
      check(req, 'menu-mob', { html: modCnf['menu-mob'], publish: false }, cb);
    },
    (cb) => {
      check(req, 'footer-l-1-c-1', { html: modCnf['footer-l-1-c-1'], publish: false }, cb);
    },
    (cb) => {
      check(req, 'footer-l-1-c-2', { html: modCnf['footer-l-1-c-2'], publish: false }, cb);
    },
    (cb) => {
      check(req, 'footer-l-1-c-3', { html: modCnf['footer-l-1-c-3'], publish: false }, cb);
    },
    (cb) => {
      check(req, 'footer-logo', { html: modCnf['footer-logo'], publish: false }, cb);
    },
    (cb) => {
      check(req, 'footer-newsletter', { html: modCnf['footer-newsletter'], publish: false }, cb);
    },
  ], (err) => {
    if (err) {
      return next(err);
    }
    res.status(201).send({ ok: 'ok' });
  });
};
