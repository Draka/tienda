const { modelSlug } = require('../../../../libs/query.lib');
const meta = require('../../libs/meta');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      modelSlug('Page', 'index', cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        const page = new models.Page({
          active: true,
          publish: true,
          title: 'Portal de Tiendas',
          slug: 'index',
          seo: 'Escriba la descripción de su portal',
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
      meta(req.params.slug, results.item.html, cb);
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
      session: req.user,
      item: results.item,
      title: results.item.title,
      js: 'page',
    });
  });
};
