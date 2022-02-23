const needle = require('needle');
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
      reference(req, results.order, req.user._id, cb);
    }],
    goPayment: ['reference', 'check', async (results) => {
      if (results.reference.urlPayment) {
        return { body: results.reference.urlPayment, statusCode: 302 };
      }
      const postData = {
        merchant_id: '78a26a71fbfc',
        reference_code: results.reference.reference,
        description: `Compra a ${results.order.store.name} a través de Santrato`,
        amount: results.order.order.total,
        tax: 0,
        tax_base: 0,
        currency: 'COP',
        buyer_email: results.order.userData.email,
        buyer_name: results.order.userData.name,
        buyer_identification_type: 'CC',
        buyer_identification_number: 88000000,
        buyer_phone: results.order.userData.cellphone,
        test: false,
        confirmation_url: `https://santrato.com/v1/orders/confirm/${req.params.orderID}`,
        response_url: `https://santrato.com/usuario/pedidos/${results.order.orderID}`,
        shipping_address: results.order.address.address,
        shipping_country: 'COLOMBIA',
        shipping_city: results.order.address.city,
      };
      const options = {
        headers: {
          authorizationToken: '869e7f7c942050b48fa8073ba262e98aa99de985a557e0f2cba581ff65d55057c9aeba852bf18ca694336f3e04b8868ddac2d25c91cd7b3ba4768528',
          'Content-Type': 'application/json',
        },
      };
      const rcv2 = await needle('post', 'https://gateway2.2transfair.com/create_transaction', postData, options);
      return { body: rcv2.body, statusCode: rcv2.statusCode };
    }],
    update: ['goPayment', (results, cb) => {
      if (results.goPayment.statusCode !== 302) {
        errors.push({ field: '2transfair', msg: 'Error en pasarela de pago' });
        return cb(listErrors(400, null, errors));
      }
      results.reference.urlPayment = results.goPayment.body;
      results.reference.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.redirect(results.goPayment.body);
  });
};
