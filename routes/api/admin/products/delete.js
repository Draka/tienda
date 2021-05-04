const { deleteS3 } = require('../../../../libs/delete_s3.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const adminQuery = {
    tenancy: req.tenancy,
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      if (req.user.admin) {
        delete adminQuery.userID;
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne(adminQuery)
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      cb();
    }],
    query: ['check', (_results, cb) => {
      models.Product
        .findById(req.params.productID)
        .exec(cb);
    }],
    check2: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'product', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    deleteS3: ['check2', (results, cb) => {
      async.each(results.query.images, (i, cb) => {
        deleteS3(`tenancy/${req.tenancy}/ecommerce/${appCnf.s3.folder}/${req.params.storeID}/products/${results.query._id}/${i}`, cb);
      }, cb);
    }],
    delete: ['deleteS3', (results, cb) => {
      results.query.remove(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
