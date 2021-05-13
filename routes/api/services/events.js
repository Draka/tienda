const sqsMailer = require('../../../libs/sqs_mailer');

module.exports = (req, res) => {
  const errors = [];
  const body = _.pick(req.body, [
    'event',
    'data',
    'environment',
    'signature',
    'timestamp',
    'sent_at',
  ]);
  body.tenancy = req.tenancy;

  let firstStatus = '';
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
          tenancy: req.tenancy,
          reference: _.get(body, 'data.transaction.reference'),
        })
        .exec(cb);
    }],
    save: ['query', (results, cb) => {
      if (!results.query) {
        return cb();
      }
      firstStatus = results.query.status;

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
      results.query.set({
        transaction: _.get(body, 'data.transaction'),
        sentAt: body.sent_at,
      }).save(cb);
    }],
    order: ['save', (results, cb) => {
      if (!results.query) {
        return cb();
      }
      if ((results.query.status === 'approved')
       || (firstStatus === 'approved' && results.query.status === 'voided')) {
        models.Order
          .findOne({
            tenancy: req.tenancy,
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
      if (results.query.status === 'approved') {
        results.order.status = 'paid';
        results.order.statuses.push({
          status: 'paid',
        });
      } else if (firstStatus === 'approved' && results.query.status === 'voided') {
        results.order.status = 'cancelledAdmin';
        results.order.statuses.push({
          status: 'cancelledAdmin',
        });
      }
      results.order.save(cb);
    }],
    mailerAdmin: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      const admin = _.get(results.order, 'storeID.userID');
      if (admin) {
        if (results.query.status === 'approved') {
          sqsMailer(req, {
            to: { email: admin.email, name: admin.personalInfo.name },
            subject: `Nueva Orden #${results.order.orderID}`,
            template: 'seller-new-order',
            order: _.pick(results.order, ['_id', 'orderID']),
          },
          admin,
          cb);
        } else {
          cb();
        }
      } else {
        cb();
      }
    }],
    mailerClient: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      if (results.query.status === 'approved') {
        sqsMailer(req, {
          to: { email: results.order.userData.email, name: results.order.userData.name },
          subject: `Orden #${results.order.orderID} Confirmada`,
          template: 'client-new-order',
          order: _.pick(results.order, ['_id', 'orderID']),
        },
        { _id: results.order.userID },
        cb);
      } else if (firstStatus === 'approved' && results.query.status === 'voided') {
        sqsMailer(req, {
          to: { email: results.order.userData.email, name: results.order.userData.name },
          subject: `Pago de Orden #${results.order.orderID} Reversado`,
          template: 'client-voided-order',
          order: _.pick(results.order, ['_id', 'orderID']),
        },
        { _id: results.order.userID },
        cb);
      } else {
        cb();
      }
    }],
  }, (err, results) => {
    res.status(200).send(err || { reference: _.get(body, 'data.transaction.reference'), orderID: _.get(results, 'order.orderID') });
  });
};
