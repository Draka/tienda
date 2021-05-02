const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');
const reference = require('../../../libs/reference.lib');

module.exports = (req, res, next) => {
  async.auto({
    order: (cb) => {
      models.Order
        .findOne({
          orderID: req.params.orderID,
        })
        .lean()
        .exec(cb);
    },
    payment: ['order', (results, cb) => {
      if (!results.order) {
        return next(listErrors(404, null, [{ field: 'order', msg: __('El pedido no existe') }]));
      }
      results.order.store._id = results.order.storeID;
      putS3LogoPath([results.order.store]);
      results.order.payment.info = _.find(global.payments, { slug: results.order.payment.slug });
      results.order.payment.file = `${appCnf.url.static}tenancy/${appCnf.tenancy}/files/${appCnf.s3.folder}/orders/${results.order._id}/${results.order.payment.file}`;
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
        link: '/administracion/super/tiendas/pedidos',
        text: 'Pedidos',
      },
      {
        link: `/administracion/super/tiendas/pedidos/${req.params.orderID}`,
        text: `Pedido #${req.params.orderID}`,
        active: true,
      },
    ];

    res.render('admin/pages/super-orders/view.pug', {
      session: req.user,
      order: results.order,
      title: 'Ver pedido',
      menu: 'super-pedidos-lista',
      breadcrumbs,
      js: 'admin',
    });
  });
};
