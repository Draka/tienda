module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['slugLong']);

  async.auto({
    validate: (cb) => {
      if (req.query.q) {
        body.$or = [
          { slug: { $regex: req.query.q, $options: 'i' } },
          { description: { $regex: req.query.q, $options: 'i' } },
          { text: { $regex: req.query.q, $options: 'i' } },
        ];
      } else if (!body.slugLong) {
        body.categoryID = null;
      }
      return cb();
    },
    query: ['validate', (results, cb) => {
      models.HelpCategory
        .find(body)
        .sort({ order: 1 })
        .lean()
        .exec(cb);
    }],
    subquery: ['query', (results, cb) => {
      if (req.query.q) {
        return cb();
      }
      async.each(results.query, (item, cb) => {
        models.HelpCategory
          .find({ categoryID: item._id })
          .sort({ order: 1 })
          .lean()
          .exec((err, docs) => {
            if (err) return cb(err);
            item.subs = docs;
            cb();
          });
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results.query);
  });
};
