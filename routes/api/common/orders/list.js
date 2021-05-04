module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    orders: ['validate', (_results, cb) => {
      models.Order
        .find({
          tenancy: req.tenancy,
          userID: req.user._id,
        })
        .select({
          store: 1,
          zone: 1,
          orderID: 1,
          order: 1,
          status: 1,
          statuses: 1,
          delivery: 1,
          payment: 1,
        })
        .sort({
          createdAt: -1,
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
            tenancy: req.tenancy,
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
                    reference: `${order.store.slug}_${order.orderID}_${num + 1}`,
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
    res.send(results.orders);
  });
};
