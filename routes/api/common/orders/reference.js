const reference = require('../../../../libs/reference.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    order: ['validate', (_results, cb) => {
      models.Order
        .findOne({
          _id: req.params.orderID,
          userID: req.user._id,
        })
        .lean()
        .exec(cb);
    }],
    check: ['order', (results, cb) => {
      if (!results.order) {
        errors.push({ field: 'order', msg: __('El pedido no existe') });
        return next(listErrors(404, null, errors));
      }
      if (results.order.status !== 'created' || !results.order.payment.pse) {
        errors.push({ field: 'reference', msg: 'Esta orden no necesita pago' });
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    payment: ['check', (results, cb) => {
      reference(results.order, req.user._id, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results.order.ref);
  });
};
