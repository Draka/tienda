const treeSlugCategory = require('../../../../libs/tree_slug_category.lib');

function refCircular(categoryID, ids, cb) {
  if (!categoryID) {
    return cb();
  }
  if (ids.indexOf(categoryID) >= 0) {
    return cb(listErrors(400, null, [{ field: 'categoryID', msg: 'Hay una referencia circular entre los padres de las categorías.' }]));
  }
  ids.push(categoryID);
  models.Category
    .findById(categoryID)
    .exec((err, doc) => {
      if (err) {
        return cb(err);
      }
      if (doc.categoryID) {
        return refCircular(doc.categoryID.toString(), ids, cb);
      }
      cb();
    });
}

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'categoryID',
    'name',
  ]);
  body.tenancy = req.tenancy;

  if (typeof req.body.categoryID !== 'undefined' && !body.categoryID) {
    body.categoryID = null;
  }
  const adminQuery = {
    tenancy: req.tenancy,
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      if (body.name && !_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Categoría válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
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
      if (body.categoryID && body.categoryID === req.params.categoryID) {
        errors.push({ field: 'categoryID', msg: 'El padre de la Categoría no puede ser ella misma' });
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
        errors.push({ field: 'categories', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      refCircular(body.categoryID, [req.params.categoryID], cb);
    }],
    save: ['check2', (results, cb) => {
      results.query.set(body).save(cb);
    }],
    fix: ['save', (results, cb) => {
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
