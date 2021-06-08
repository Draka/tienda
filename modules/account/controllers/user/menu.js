module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    const item = {
      seo: 'Mi cuenta',
    };
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/usuario',
        text: 'Cuenta',
        active: true,
      },
    ];

    res.render('../modules/account/view/user/menu.pug', {
      req,
      item,
      title: 'Mi cuenta',
      breadcrumbs,
      js: 'store',
    });
  });
};
