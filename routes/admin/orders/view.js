const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');
const reference = require('../../../libs/reference.lib');

module.exports = (req, res, next) => {
  async.auto({
    order: (cb) => {
      models.Order
        .findOne({ tenancy: req.tenancy,
          orderID: req.params.orderID,
        })
        .lean()
        .exec(cb);
    },
    payment: ['order', (results, cb) => {
      if (!results.order) {
        return next(listErrors(404, null, [{ field: 'order', msg: 'El registro no existe.' }]));
      }
      results.order.store._id = results.order.storeID;
      putS3LogoPath(req, [results.order.store]);
      results.order.payment.info = _.find(global.payments, { slug: results.order.payment.slug });
      results.order.payment.file = `${appCnf.url.cdn}tenancy/${req.tenancy}/files/${appCnf.s3.folder}/orders/${results.order._id}/${results.order.payment.file}`;
      reference(results.order, req.user._id, cb);
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
        link: '/administracion/tiendas/pedidos',
        text: 'Pedidos',
      },
      {
        link: `/administracion/tiendas/pedidos/${req.params.orderID}`,
        text: `Pedido #${req.params.orderID}`,
        active: true,
      },
    ];

    res.render('admin/pages/orders/view.pug', {
      req,
      order: results.order,
      title: 'Ver pedido',
      menu: 'pedidos-lista',
      breadcrumbs,
      js: 'admin',
    });
  });
};
