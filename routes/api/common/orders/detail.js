module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    orders: ['validate', (_results, cb) => {
      models.Order
        .find({
          orderID: { $in: req.params.id.split(',') },
          userID: req.user._id
        })
        .select({
          orderID: 1,
          order: 1,
          store: 1,
          status: 1,
          statuses: 1,
          delivery: 1,
          payment: 1,
          address: 1,
          products: 1,
          userData: 1,
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
            status: { $in: ['created', 'approved'] }
          })
          .exec((err, doc) => {
            if (err) return cb(err);
            // crea el pago
            if (!doc) {
              models.Payment
                .countDocuments({
                  orderID: order._id
                })
                .exec((err, num) => {
                  if (err) return cb(err);
                  order.ref = new models.Payment({
                    orderID: order._id,
                    userID: req.user._id,
                    status: 'created',
                    reference: `${order.store.slug}_${order.orderID}_${num + 1}`
                  });
                  order.ref.save(cb);
                });
            } else {
              order.ref = doc;
              cb();
            }
          });
      }, cb);
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (!results.orders) {
      errors.push({ field: 'order', msg: __('El pedido no existe') });
      return next(listErrors(404, null, errors));
    }
    results.orders.forEach((order) => {
      if (['paid', 'picking', 'ready', 'onway', 'arrived', 'missing', 'completed'].indexOf(order.status) === -1) {
        // quita valores privadoss
        _.each(order.products, (i) => {
          if (i.digital) {
            delete i.digital.msg;
            delete i.digital.url;
          }
        });
      }
    });
    res.send({ orders: results.orders });
  });
};
