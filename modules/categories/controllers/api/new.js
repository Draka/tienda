const query = require('../../libs/query.lib');

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
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Categoría válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Category
        .findOne({
          tenancy: req.tenancy,
          slug: _.kebabCase(_.deburr(_.trim(body.name))),
          categoryID: body.categoryID,
        })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
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
      query.tree({ tenancy: req.tenancy }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results.create);
  });
};
