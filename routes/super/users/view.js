module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      models.User
        .findById(req.params.userID)
        .lean()
        .exec(cb);
    },
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
        link: '/administracion/super/usuarios',
        text: 'Usuarios',
      },
      {
        link: `/administracion/super/usuarios/${req.params.orderID}`,
        text: 'Ver usuario',
        active: true,
      },
    ];

    res.render('admin/pages/super-users/view.pug', {
      session: req.user,
      item: results.user,
      title: 'Ver usuario',
      menu: 'super-usuarios-lista',
      breadcrumbs,
      js: 'admin',
    });
  });
};
