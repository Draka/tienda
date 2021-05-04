module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'categoryID',
    'active',
    'question',
    'answer',
  ]);
  body.tenancy=req.tenancy;

  if (typeof req.body.active !== 'undefined' && !body.active) {
    body.active = false;
  }
  async.auto({
    validate: (cb) => {
      if (!_.trim(body.question)) {
        errors.push({ field: 'question', msg: 'Escribe una Pregunta válida.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Faq
        .findOne({ tenancy: req.tenancy, slug: _.kebabCase(_.deburr(body.question)) })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query) {
        errors.push({ field: 'slug', msg: 'Ya existe una Pregunta con el mismo slug.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (results, cb) => {
      const faq = new models.Faq(body);
      faq.save(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(results.create);
  });
};
