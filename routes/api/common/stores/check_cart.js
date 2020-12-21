
const { validateProducts } = require('../../../libs/ecommerce.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['place', 'items']);

  async.auto({
    validate: (cb) => {
      if (!_.isPlainObject(body.items) || !(Object.keys(body.items)).length) {
        errors.push({ field: 'items', msg: req.__('El carrito de compras esta vacio.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne({
          slug: req.params.store,
        })
        .select({
          name: 1,
          slug: 1
        })
        .populate({
          path: 'defaultPlace',
          select: 'name slugLong capacity'
        })
        .exec(cb);
    }],
    // busca la tienda de entrega en el radio
    place: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: req.__('No existe la tienda') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      models.Zone
        .findOne({
          storeID: results.store._id,
          active: true,
          isStore: true,
          slugLong: body.place
        })
        .select({
          name: 1,
          slugLong: 1,
          capacity: 1
        })
        .exec(cb);
    }],
    // valida que los productos existan
    validateItems: ['place', (results, cb) => {
      validateProducts(results, body.items, cb);
    }]
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    // quita valores privadoss
    _.each(results.validateItems.items, (i) => {
      if (i.digital) { delete i.digital.msg; delete i.digital.url; }
    });
    _.each(results.validateItems.noActives, (i) => {
      if (i.digital) { delete i.digital.msg; delete i.digital.url; }
    });
    _.each(results.validateItems.changePrice, (i) => {
      if (i.digital) { delete i.digital.msg; delete i.digital.url; }
    });
    res.send(results);
  });
};
