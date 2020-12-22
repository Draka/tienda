const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    items: ['user', (results, cb) => {
      models.Store
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          sku: 1,
        })
        .populate({
          path: 'userID',
          select: 'email personalInfo',
        })
        .lean()
        .exec(cb);
    }],
    postFind: ['items', (results, cb) => {
      putS3LogoPath(results.items);
      cb();
    }],
    count: ['user', (_results, cb) => {
      models.Store
        .countDocuments(body)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/tiendas',
        text: 'Aprobar Tiendas',
        active: true,
      },
    ];

    res.render('admin/pages/super-stores/list.pug', {
      session: req.user,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Aprobar Tiendas',
      menu: 'super-tiendas',
      breadcrumbs,
    });
  });
};
