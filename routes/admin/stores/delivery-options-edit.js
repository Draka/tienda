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
        link: `/administracion/tiendas/${req.params.storeID}/opciones-de-entrega`,
        text: 'Opciones de entrega',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/opciones-de-entrega/editar`,
        text: 'Editar',
        active: true,
      },
    ];

    const deliveries = _.map(global.deliveries, (delivery) => {
      const d = _.find(results.store.deliveries, { slug: delivery.slug });
      return {
        slug: delivery.slug,
        active: _.get(d, 'active') || false,
        name: delivery.name,
        description: delivery.description,
        payments: delivery.payments,
        value: _.get(d, 'value') || 0,
      };
    });

    res.render('admin/pages/stores/delivery-options-edit.pug', {
      user: results.user,
      store: results.store,
      deliveries,
      title: 'Opciones de entrega',
      menu: 'tienda-opciones-de-entrega',
      breadcrumbs,
    });
  });
};
