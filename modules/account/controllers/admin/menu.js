module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }

    // Si tiene tienda, lo envia a la vista
    if (!_.get(req, 'user.options.storeSelect')) {
      return res.redirect('/administracion/tiendas/nuevo');
    }

    const item = {
      seo: 'Mi cuenta',
    };
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administracion',
        active: true,
      },
    ];

    res.render('../modules/account/view/admin/menu.pug', {
      req,
      item,
      title: 'Mi cuenta',
      breadcrumbs,
      js: 'admin',
    });
  });
};
