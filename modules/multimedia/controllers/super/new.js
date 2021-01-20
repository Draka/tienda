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
        link: '/administracion/super/multimedia',
        text: 'Multimedia',
      },
      {
        link: '/administracion/super/multimedia/nuevo',
        text: 'Nuevo',
        active: true,
      },
    ];

    res.render('../modules/multimedia/views/super/new.pug', {
      session: req.user,
      title: 'Nuevo Archivo Multimedia',
      menu: 'super-multimedia',
      breadcrumbs,
      js: 'admin',
    });
  });
};
