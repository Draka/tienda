const breadcrumbs = [
  {
    link: '/administracion',
    text: 'Administración',
  },
  {
    text: 'Tienda',
  },
  {
    link: '/administracion/tiendas/nuevo',
    text: 'Nueva',
    active: true,
  },
];

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    store: ['user', (results, cb) => {
      query.store(_.get(results, 'user.options.storeSelect'), cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const msg = {
      color: 'action',
      title: 'Tienda creada',
      text: `La tienda, <b>${results.store.name}</b> se ha creado.<br> Ingrese a su configuración <a href="/administracion/tiendas/${results.store._id}">aquí</a>`,
    };
    res.render('admin/pages/messages/general.pug', {
      req,
      user: results.user,
      title: 'Tienda',
      menu: 'tienda/nuevo',
      msg,
      breadcrumbs,
    });
  });
};
