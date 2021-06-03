module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const item = {
      seo: 'Tu cuenta',
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
      title: 'Tu cuenta',
      count: results.count,
      breadcrumbs,
      js: 'store',
    });
  });
};
