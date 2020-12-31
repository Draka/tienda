const sqsMailer = require('../../../libs/sqs_mailer');

module.exports = (req, res) => {
  const errors = [];
  const body = _.pick(req.body, [
    'event',
    'data',
    'sent_at',
  ]);
  async.auto({
    validate: (cb) => {
      if (req.params.token !== 'token666') {
        errors.push({ field: 'eventos', msg: req.__('Evento no soportado.') });
      }
      if (body.event !== 'transaction.updated') {
        errors.push({ field: 'eventos', msg: req.__('Evento no soportado.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Payment
        .findOne({
          reference: _.get(body, 'data.transaction.reference'),
          status: 'created',
        })
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        const payment = new models.Payment({
          status: 'created',
          reference: _.get(body, 'data.transaction.reference'),
          transaction: _.get(body, 'data.transaction'),
          sentAt: body.sent_at,
        });
        return payment.save(cb);
      }

      switch (_.get(body, 'data.transaction.status')) {
        case 'APPROVED': // Transacción aprobada
          results.query.status = 'approved';
          break;
        case 'DECLINED': // Transacción rechazada
          results.query.status = 'declined';
          break;
        case 'VOIDED':// Transacción anulada (sólo aplica pra transacciones con tarjeta)
          results.query.status = 'voided';
          break;
        default: // Error interno del método de pago respectivo
          results.query.status = 'error';
          break;
      }
      results.query.set({ transaction: _.get(body, 'data.transaction'), sentAt: body.sent_at }).save(cb);
    }],
    order: ['save', (results, cb) => {
      if (!results.query) {
        return cb();
      }
      if (1 || results.query.status === 'approved') {
        models.Order
          .findOne({
            _id: results.query.orderID,
          })
          .populate({
            path: 'storeID',
            select: 'name',
            populate: {
              path: 'userID',
              select: 'email personalInfo',
            },
          })
          .exec(cb);
      } else {
        return cb();
      }
    }],
    update: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      results.order.status = 'paid';
      results.order.statuses.push({
        status: 'paid',
        userID: req.user._id,
      });
      results.order.save(cb);
    }],
    mailerAdmin: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      const admin = _.get(results.order, 'storeID.userID');
      if (admin) {
        sqsMailer({
          to: { email: admin.email, name: admin.personalInfo.name },
          subject: `Nueva Orden #${results.order.orderID}`,
          template: 'seller-new-order',
          order: _.pick(results.order, ['_id', 'orderID']),
        }, admin,
        cb);
      } else {
        cb();
      }
    }],
    mailerClient: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      sqsMailer({
        to: { email: results.order.userData.email, name: results.order.userData.name },
        subject: `Orden #${results.order.orderID} Confirmada`,
        template: 'client-new-order',
        order: _.pick(results.order, ['_id', 'orderID']),
      }, { _id: results.order.userID },
      cb);
    }],
  }, (err, results) => {
    res.status(200).send(err || results);
  });
};
