const sqsMailer = require('../../../../libs/sqs-mailer.lib');
const { orderToMail } = require('../../../../libs/util.lib');

module.exports = (req, res, next) => {
  const errors = [];

  const { body } = req;
  try {
    body.response = JSON.parse(body.response);
  } catch (error) {
    body.response = req.body.response;
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
      if (body.response.status === 'PAID') {
        results.reference.status = 'approved';
      }
      results.reference.transaction = { body, query: req.query, params: req.params };
      results.reference.save(cb);
    }],
    updateOrder: ['updatePayment', (results, cb) => {
      if (body.response.status === 'PAID') {
        results.order.status = 'paid';
        results.order.statuses.push({
          status: 'paid',
        });
        results.order.save(cb);
      } else { cb(); }
    }],
    mailerAdmin: ['order', (results, cb) => {
      if (!results.order) {
        return cb();
      }
      const admin = _.get(results.order, 'storeID.userID');
      console.log('ADMIN', admin);
      if (admin) {
        if (body.response.status === 'PAID') {
          const orderFormat = orderToMail(results.order);

          sqsMailer(req, {
            to: { email: admin.email, name: admin.personalInfo.name },
            template: 'seller-new-order',
            order: orderFormat,
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
      const orderFormat = orderToMail(results.order);
      if (body.response.status === 'PAID') {
        sqsMailer(req, {
          to: { email: results.order.userData.email, name: results.order.userData.name },
          template: 'client-new-order',
          order: orderFormat,
        },
        { _id: results.order.userID },
        cb);
      } else {
        sqsMailer(req, {
          to: { email: results.order.userData.email, name: results.order.userData.name },
          template: 'client-voided-order',
          order: orderFormat,
        },
        { _id: results.order.userID },
        cb);
      }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results);
  });
};
