const { modelSlug } = require('../../../../libs/query.lib');
const { meta } = require('../../libs/meta');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      modelSlug(req, 'Page', req.params.slug, cb);
    },
    meta: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'pageID', msg: 'El registro no existe.' }]));
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
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: `/paginas/${req.params.slug}`,
        text: `${results.item.title}`,
        active: true,
      },
    ];
    results.item.html = results.meta;

    res.render('../modules/pages/views/common/view.pug', {
      req,
      item: results.item,
      title: results.item.title,
      breadcrumbs,
      js: 'page',
    });
  });
};
