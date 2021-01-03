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
        link: '/administracion/super/documentos',
        text: 'Documentos',
      },
      {
        link: '/administracion/super/documentos/nuevo',
        text: 'Nueva Página',
        active: true,
      },
    ];

    res.render('admin/pages/super-documents/new.pug', {
      session: req.user,
      title: 'Nuevo Documento',
      menu: 'tienda-documentos',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
