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
        link: '/administracion/super/planes',
        text: 'Plans',
      },
      {
        link: '/administracion/super/planes/nuevo',
        text: 'Nueva Página',
        active: true,
      },
    ];

    res.render('admin/pages/super-plans/new.pug', {
      session: req.user,
      title: 'Nuevo Plan',
      menu: 'super-planes',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
