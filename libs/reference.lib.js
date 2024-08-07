module.exports = (order, userID, cb) => {
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
              amount: order.order.total,
              orderID: order._id,
              userID,
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
};
