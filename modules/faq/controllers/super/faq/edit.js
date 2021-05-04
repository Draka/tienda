const { modelAll } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Faq
        .findById(req.params.faqID)
        .exec(cb);
    },
    categories: ['item', (_results, cb) => {
      modelAll('FaqCategory', cb);
    }],
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'faqID', msg: 'El registro no existe.' }]));
      }
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/faq',
        text: 'FAQ',
      },
      {
        link: `/administracion/super/faq/${req.params.faqID}/editar`,
        text: `Editar - ${results.item.question}`,
        active: true,
      },
    ];

    res.render('../modules/faq/views/super/faq/edit.pug', {
      req,
      item: results.item,
      categories: results.categories,
      title: 'Editar FAQ',
      menu: 'super-faq',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
