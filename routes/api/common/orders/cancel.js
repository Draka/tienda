module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['reason', 'id']);
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.reason)) {
        errors.push({ field: 'reason', msg: __('Debe especificar una razón para cancelar.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    order: ['validate', (_results, cb) => {
      models.Order
        .findOne({
          orderID: body.id,
          userID: req.user._id,
        })
        .select({
          status: 1,
          statuses: 1,
          orderID: 1,
        })
        .exec(cb);
    }],
    cancel: ['order', (results, cb) => {
      if (!results.order) {
        errors.push({ field: 'order', msg: __('El pedido no existe') });
        return next(listErrors(404, null, errors));
      }
      if (['cancelled', 'cancelledAdmin'].indexOf(results.order.status) >= 0) {
        errors.push({ field: 'status', msg: __('EL pedido ya está cancelado') });
        return next(listErrors(400, null, errors));
      }
      if (['created'].indexOf(results.order.status) === -1) {
        errors.push({ field: 'status', msg: __('El pedido no se puede cancelar') });
        return next(listErrors(400, null, errors));
      }
      results.order.statuses.push({
        status: 'cancelled',
        reason: body.reason,
      });
      results.order.status = 'cancelled';
      console.log(results.order);
      results.order.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results.cancel);
  });
};
