module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['reason']);
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
        .findById(req.params.orderID)
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
      if (['completed'].indexOf(results.order.status) >= 0) {
        errors.push({ field: 'status', msg: __('El pedido no se puede cancelar') });
        return next(listErrors(400, null, errors));
      }
      results.order.statuses.push({
        status: 'cancelledAdmin',
        reason: body.reason,
        userID: req.user._id,
      });
      results.order.status = 'cancelledAdmin';
      results.order.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(_.pick(results.cancel, [
      '_id',
      'orderID',
      'status',
      'statuses',
    ]));
  });
};