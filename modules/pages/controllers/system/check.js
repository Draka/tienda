const modCnf = require('../../modCnf');

function check(slug, pDefault, cb) {
  if (!_.isFunction(cb)) {
    cb = () => {};
  }
  pDefault = pDefault || {};
  models.Page
    .findOne({ slug })
    .lean()
    .exec((err, doc) => {
      if (err) {
        return cb(err);
      }
      if (!doc) {
        const page = new models.Page({
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

module.exports = () => {
  check('index', { html: modCnf.index, publish: true });
  check('menu', { html: modCnf.menu, publish: false });
  check('menu-mob', { html: modCnf['menu-mob'], publish: false });
  check('footer-l-1-c-1', { html: modCnf['footer-l-1-c-1'], publish: false });
  check('footer-l-1-c-2', { html: modCnf['footer-l-1-c-2'], publish: false });
  check('footer-l-2-c-1', { html: modCnf['footer-l-2-c-1'], publish: false });
  check('footer-l-2-c-2', { html: modCnf['footer-l-2-c-2'], publish: false });
  check('footer-l-2-c-3', { html: modCnf['footer-l-2-c-3'], publish: false });
};
