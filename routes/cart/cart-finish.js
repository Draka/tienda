module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    orders: ['validate', (_results, cb) => {
      models.Order
        .find({
          userID: req.user._id,
        })
        .sort({
          createdAt: 1,
        })
        .lean()
        .exec(cb);
    }],
    payment: ['orders', (results, cb) => {
      async.eachLimit(results.orders, 10, (order, cb) => {
        if (order.status !== 'created' || !order.payment.pse) {
          return cb();
        }
        models.Payment
          .findOne({
            orderID: order._id,
            status: { $in: ['created', 'approved'] },
          })
          .exec((err, doc) => {
            if (err) return cb(err);
            // crea el pago
            if (!doc) {
              models.Payment
                .countDocuments({
                  orderID: order._id,
                })
                .exec((err, num) => {
                  if (err) return cb(err);
                  order.ref = new models.Payment({
                    orderID: order._id,
                    userID: req.user._id,
                    status: 'created',
                    reference: `${appCnf.tenancy}__${order.store.slug}_${order.orderID}_${num + 1}`,
                  });
                  order.ref.save(cb);
                });
            } else {
              order.ref = doc;
              cb();
            }
          });
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    console.log(results.orders);
    res.render('pages/cart/cart-finish', {
      session: req.user,
      title: __('Carrito de compras -> Resumen pedido'),
      js: 'page',
      wompi: true,
      orders: results.orders,
    });
  });
};
