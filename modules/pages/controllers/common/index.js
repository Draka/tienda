const { modelSlug } = require('../../../../libs/query.lib');
const { meta } = require('../../libs/meta');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      modelSlug(req, 'Page', 'index', cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        const page = new models.Page({
          tenancy: req.tenancy,
          active: true,
          publish: true,
          title: req.site.title,
          slug: 'index',
          seo: req.site.description,
          html: '',
        });
        page.save(cb);
      } else {
        cb();
      }
    }],
    meta: ['check', (results, cb) => {
      if (!results.item) {
        results.item = results.check;
      }
      // Busca todos los meta para convertir
      meta(req, req.params.slug, results.item.html, true, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (!results.site) {
      results.site = {};
    }
    results.item.html = results.meta;

    res.render('../modules/pages/views/common/index.pug', {
      req,
      item: results.item,
      title: results.item.title,
      js: 'page',
    });
  });
};
