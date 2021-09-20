module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    store: (cb) => {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          _id: req.user.options.storeSelect,
        })
        .exec(cb);
    },
  }, (err, results) => {
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
      store: results.store,
      item,
      title: 'Mi cuenta',
      breadcrumbs,
      js: 'admin',
    });
  });
};
