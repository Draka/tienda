module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/faq-categorias',
        text: 'FAQ Categorías',
      },
      {
        link: '/administracion/super/faq-categorias/nuevo',
        text: 'FAQ Categorías',
        active: true,
      },
    ];

    res.render('../modules/faq/views/super/faq-categorias/new.pug', {
      req,
      title: 'Nueva Categoría',
      menu: 'super-faq-categorias',
      breadcrumbs,
      js: 'admin',
    });
  });
};
