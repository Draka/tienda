const query = require('../../../../libs/query.lib');
const { checkProduct } = require('../../../../modules/site/libs/check-store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'publish',
    'name',
    'inventory',
    'stock',
    'price',
    'sku',
    'upc',
    'brandText',
    'shortDescription',
    'longDescription',
    'featured',
    'features',
    'digital',
    'available',
    'groups',
    'weight',
    'length',
    'height',
    'width',
  ]);
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  if (body.digital && typeof body.digital.is !== 'undefined' && !body.digital.is) {
    _.set(body, 'digital.is', false);
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Producto válido.' });
      }
      if (!_.trim(body.sku)) {
        errors.push({ field: 'sku', msg: 'Escribe un SKU de Producto válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne({ _id: req.params.storeID, userID: req.user._id })
        .exec(cb);
    }],
    query: ['validate', (_results, cb) => {
      models.Product
        .findOne({ sku: body.sku, storeID: req.params.storeID })
        .exec(cb);
    }],
    check: ['store', 'query', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      if (results.query) {
        errors.push({ field: 'sku', msg: 'Ya existe un producto con ese sku.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    category: ['check', (_results, cb) => {
      if (!req.body.categoryID) {
        return cb();
      }
      query.up([], req.body.categoryID._id || req.body.categoryID, cb);
    }],
    create: ['category', (results, cb) => {
      if (results.category) {
        body.categoryIDs = _.map(results.category, (o) => o._id);
        body.categoryText = _.map(results.category, (o) => o.name);
      }
      body.storeID = req.params.storeID;
      const product = new models.Product(body);
      if (product.publish) {
        checkProduct(results.store, product, cb);
      } else {
        product.save(cb);
      }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
