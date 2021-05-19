const query = require('../../libs/query.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => cb(),
    query: ['validate', (_results, cb) => {
      models.Category
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.categoryID,
        })
        .exec(cb);
    }],
    check2: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'categories', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    productsToNull: ['check2', (results, cb) => {
      models.Product
        .updateMany({ categoryID: req.params.categoryID }, { categoryID: null })
        .exec(cb);
    }],
    categoryToNull: ['check2', (results, cb) => {
      models.Category
        .updateMany({ categoryID: req.params.categoryID }, { categoryID: null })
        .exec(cb);
    }],
    delete: ['check2', (results, cb) => {
      results.query
        .remove(cb);
    }],
    fix: ['delete', (results, cb) => {
      query.tree({ tenancy: req.tenancy }, cb);
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
