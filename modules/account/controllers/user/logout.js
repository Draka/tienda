module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    const item = {
      seo: 'Cerrar Sesión',
    };
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/cerrar-sesion',
        text: 'Cerrar Sesión',
        active: true,
      },
    ];

    res.render('../modules/account/view/user/logout.pug', {
      req,
      item,
      title: 'Cerrar Sesión',
      breadcrumbs,
      js: 'store',
    });
  });
};
