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
        link: '/administracion/super/paginas',
        text: 'Páginas',
      },
      {
        link: '/administracion/super/paginas/nuevo',
        text: 'Nueva Página',
        active: true,
      },
    ];

    res.render('../modules/pages/views/super/new.pug', {
      req,
      title: 'Nueva Página',
      menu: 'super-paginas',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
