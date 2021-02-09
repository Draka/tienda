const treeSlugCategory = require('../../../../libs/tree_slug_category.lib');

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
  if (typeof req.body.categoryID !== 'undefined' && !body.categoryID) {
    body.categoryID = null;
  }
  const adminQuery = {
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
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
    query: ['validate', (_results, cb) => {
      models.Category
        .findOne({ slug: _.kebabCase(_.deburr(_.trim(body.slug))), storeID: req.params.storeID, categoryID: body.categoryID })
        .exec(cb);
    }],
    check: ['store', 'query', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      if (results.query) {
        errors.push({ field: 'name', msg: 'Ya existe una Categoría en la misma ruta.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (_results, cb) => {
      body.storeID = req.params.storeID;
      const category = new models.Category(body);
      category.save(cb);
    }],
    fix: ['create', (results, cb) => {
      treeSlugCategory({ storeID: req.params.storeID }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results.create);
  });
};
