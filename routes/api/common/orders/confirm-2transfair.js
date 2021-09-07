module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    order: ['validate', (_results, cb) => {
      models.Order
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.orderID,
          userID: req.user._id,
        })
        .exec(cb);
    }],
    check: ['order', (results, cb) => {
      if (!results.order) {
        errors.push({ field: 'order', msg: 'El registro no existe.' });
        return next(listErrors(404, null, errors));
      }
      if (results.order.status !== 'created' || !results.order.payment.pse) {
        errors.push({ field: 'reference', msg: 'Esta orden no necesita pago' });
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    reference: ['order', (results, cb) => {
      models.Payment
        .findOne({
          tenancy: req.tenancy,
          orderID: req.params.orderID,
          status: { $in: ['created', 'approved'] },
        })
        .exec(cb);
    }],
    update: ['reference', (results, cb) => {
      results.reference.transaction = { body: req.body, query: req.query, params: req.params };
      results.reference.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results);
  });
};
