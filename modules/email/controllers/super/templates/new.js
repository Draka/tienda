module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
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
        link: '/administracion/super/emails-plantillas',
        text: 'Email Plantillas',
      },
      {
        link: '/administracion/super/emails-plantillas/nuevo',
        text: 'Email Plantillas',
        active: true,
      },
    ];

    res.render('../modules/email/views/super/templates/new.pug', {
      session: req.user,
      items: results.items,
      title: 'Nueva Plantilla',
      menu: 'super-emails-plantillas',
      breadcrumbs,
      js: 'admin',
      cke: true,
    });
  });
};
