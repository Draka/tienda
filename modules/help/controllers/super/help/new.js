const { modelAll } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    categories: ['validate', (_results, cb) => {
      modelAll('HelpCategory', cb);
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
        link: '/administracion/super/ayuda',
        text: 'Ayuda Categorías',
      },
      {
        link: '/administracion/super/ayuda/nuevo',
        text: 'Ayuda Categorías',
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help/new.pug', {
      session: req.user,
      categories: results.categories,
      title: 'Nueva Categoría',
      menu: 'super-help',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
