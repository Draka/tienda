const sqsMailer = require('../../../../libs/sqs_mailer');

module.exports = (req, res, next) => {
  const errors = [];
  const body = {
    _id: req.params.orderID,
    status: req.body.status,
  };

  async.auto({
    validate: (cb) => {
      if (['paid', 'picking', 'ready', 'onway', 'arrived', 'missing'].indexOf(req.body.status) === -1) {
        errors.push({ field: 'order', msg: __('No se puede cambiar el estado') });
        return cb(listErrors(404, null, errors));
      }
      cb();
    },
    stores: ['validate', (results, cb) => {
      models.Store
        .find({ userID: req.user._id })
        .lean()
        .exec(cb);
    }],
    order: ['stores', (results, cb) => {
      body.storeID = { $in: _.map(results.stores, '_id') };
      models.Order
        .findOne(body)
        .exec(cb);
    }],
    save: ['order', (results, cb) => {
      if (!results.order) {
        errors.push({ field: 'order', msg: __('El pedido no existe') });
        return cb(listErrors(404, null, errors));
      }
      if (results.order.status === 'paid') {
        results.order.status = 'picking';
        results.order.statuses.push({
          status: 'picking',
          userID: req.user._id,
        });
        results.order.save(cb);
      } else if (results.order.status === 'picking') {
        results.order.status = 'ready';
        results.order.statuses.push({
          status: 'ready',
          userID: req.user._id,
        });
        results.order.save(cb);
      } else if (results.order.status === 'ready') {
        results.order.status = 'onway';
        results.order.statuses.push({
          status: 'onway',
          userID: req.user._id,
        });
        results.order.save(cb);
      } else {
        errors.push({ field: 'order', msg: __('No se puede cambiar el estado') });
        return cb(listErrors(403, null, errors));
      }
    }],
    mailerClient: ['save', (results, cb) => {
      sqsMailer({
        to: { email: results.order.userData.email, name: results.order.userData.name },
        subject: `Orden #${results.order.orderID} a cambiado a ${global.statusText(results.order.status)}`,
        template: 'client-order-change-status',
        order: _.pick(results.order, ['_id', 'orderID', 'status']),
      }, { _id: results.order.userID },
      cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results.order);
  });
};
