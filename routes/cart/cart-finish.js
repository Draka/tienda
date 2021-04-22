const reference = require('../../libs/reference.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    orders: ['validate', (_results, cb) => {
      models.Order
        .find({
          userID: req.user._id,
          status: {
            $in: [
              'created',
              'picking',
            ],
          },
        })
        .sort({
          createdAt: 1,
        })
        .lean()
        .exec(cb);
    }],
    payment: ['orders', (results, cb) => {
      async.eachLimit(results.orders, 10, (order, cb) => {
        order.payment.info = _.find(global.payments, { slug: order.payment.slug });
        reference(order, req.user._id, cb);
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('pages/cart/cart-finish', {
      session: req.user,
      title: __('Carrito de compras -> Resumen pedido'),
      js: 'page',
      wompi: true,
      orders: results.orders,
    });
  });
};
