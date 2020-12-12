const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, global.session);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      if (results.user.admin) {
        return cb();
      }
      if (results.user.id === results.store.userID) {
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
    }],
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
        link: '/administracion/tiendas',
        text: 'Tiendas',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/opciones-de-pago`,
        text: 'Opciones de pago',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/opciones-de-pago/editar`,
        text: 'Editar',
        active: true,
      },
    ];

    const payments = _.map(global.payments, (payment) => {
      const d = _.find(results.store.payments, { slug: payment.slug });
      return {
        slug: payment.slug,
        active: _.get(d, 'active') || false,
        name: payment.name,
        description: payment.description,
      };
    });

    res.render('admin/pages/stores/payment-options-edit.pug', {
      user: results.user,
      store: results.store,
      payments,
      title: 'Opciones de pago',
      menu: 'tienda-opciones-de-pago',
      breadcrumbs,
    });
  });
};
