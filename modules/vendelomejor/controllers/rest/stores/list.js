const { putS3LogoPath } = require('../../../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['slug']);
  body.tenancy = req.tenancy;

  const limit = Math.min(Math.max(1, req.query.limit) || 100, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      body.approve = true;
      body.publish = true;
      if (req.query.q) {
        body.$or = [
          { department: { $regex: req.query.q, $options: 'i' } },
          { town: { $regex: req.query.q, $options: 'i' } },
          { primaryActivity: { $regex: req.query.q, $options: 'i' } },
          { slug: { $regex: req.query.q, $options: 'i' } },
        ];
      }
      return cb();
    },
    items: ['validate', (results, cb) => {
      models.Store
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .lean()
        .exec(cb);
    }],
    postFind: ['items', (results, cb) => {
      putS3LogoPath(req, results.items);
      cb();
    }],
    count: ['validate', (_results, cb) => {
      models.Store
        .countDocuments(body)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send({
      items: results.items.map((i) => _.pick(i, [
        'name',
        'slug',
        'contacts',
        'slogan',
        'imageSizes.logo',
        'department',
        'town',
        'primaryActivity',
        'url',
      ])),
      limit,
      page,
      count: results.count,
    });
  });
};
