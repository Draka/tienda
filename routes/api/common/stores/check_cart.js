const validateProducts = require('../../../../libs/validate_products.lib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['place', 'items']);
  body.tenancy = req.tenancy;

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
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    }],
    // valida que los productos existan
    validateItems: ['store', (results, cb) => {
      validateProducts(results.store, body.items, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    // quita valores privadoss
    _.each(results.validateItems.items, (i) => {
      if (i.digital) { delete i.digital.msg; }
    });
    _.each(results.validateItems.noActives, (i) => {
      if (i.digital) { delete i.digital.msg; }
    });
    _.each(results.validateItems.changePrice, (i) => {
      if (i.digital) { delete i.digital.msg; }
    });
    res.send({
      store: _.pick(results.store, ['_id', 'slug', 'name']),
      validateItems: results.validateItems,
    });
  });
};
