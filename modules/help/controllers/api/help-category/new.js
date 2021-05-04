const { treeSlugCategory } = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'order',
    'name',
    'description',
    'text',
    'categoryID',
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
      models.HelpCategory
        .findOne({ tenancy: req.tenancy, slug: _.kebabCase(_.deburr(body.name)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe una Categoría con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const helpCategory = new models.HelpCategory(body);
      helpCategory.save(cb);
    }],
    fix: ['create', (results, cb) => {
      treeSlugCategory({}, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
