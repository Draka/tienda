module.exports = (req, res, next) => {
  const errors = [];

  let body;
  try {
    body = JSON.parse(req.body);
  } catch (error) {
    body = req.body;
  }

  async.auto({
    validate: (cb) => {
      cb();
    },
    order: ['validate', (_results, cb) => {
      models.Order
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.orderID,
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
    updatePayment: ['reference', (results, cb) => {
      console.log(body);
      if (body.status === 'PAID') {
        results.reference.status = 'approved';
      }
      results.reference.transaction = { body, query: req.query, params: req.params };
      results.reference.save(cb);
    }],
    updateOrder: ['updatePayment', (results, cb) => {
      if (body.status === 'PAID') {
        results.order.status = 'paid';
        results.order.statuses.push({
          status: 'paid',
        });
        results.order.save(cb);
      } else { cb(); }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results);
  });
};
