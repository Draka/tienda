const treeSlugCategory = require('../../../../libs/tree_slug_category.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne({ _id: req.params.storeID, userID: req.user._id })
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
      models.Category
        .findById(req.params.categoryID)
        .exec(cb);
    }],
    check2: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'categories', msg: 'No existe la Categoría.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    productsToNull: ['check2', (results, cb) => {
      models.Product
        .update({ categoryID: req.params.categoryID }, { categoryID: null }, { multi: true })
        .exec(cb);
    }],
    categoryToNull: ['check2', (results, cb) => {
      models.Category
        .update({ categoryID: req.params.categoryID }, { categoryID: null }, { multi: true })
        .exec(cb);
    }],
    delete: ['check2', (results, cb) => {
      models.Category
        .findByIdAndDelete(req.params.categoryID)
        .exec(cb);
    }],
    fix: ['delete', (results, cb) => {
      treeSlugCategory({ storeID: req.params.storeID }, cb);
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
