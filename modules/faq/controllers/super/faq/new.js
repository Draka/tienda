const { modelAll } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    categories: ['validate', (_results, cb) => {
      modelAll(req, 'FaqCategory', cb);
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
        text: 'FAQ Categorías',
      },
      {
        link: '/administracion/super/faq/nuevo',
        text: 'FAQ Categorías',
        active: true,
      },
    ];

    res.render('../modules/faq/views/super/faq/new.pug', {
      req,
      categories: results.categories,
      title: 'Nueva Categoría',
      menu: 'super-faq',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
