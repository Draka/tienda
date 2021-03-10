const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    check: ['user', (results, cb) => {
      if (results.user.admin || results.user.adminStore) {
        body.userID = req.user._id;
        if (req.query.q) {
          body.$or = [
            { slug: { $regex: req.query.q, $options: 'i' } },
          ];
        }
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No tienes una cuenta para administrar tiendas.' }]));
    }],
    items: ['check', (results, cb) => {
      models.Store
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          sku: 1,
        })
        .lean()
        .exec(cb);
    }],
    postFind: ['items', (results, cb) => {
      putS3LogoPath(results.items);
      cb();
    }],
    count: ['check', (_results, cb) => {
      models.Product
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
        link: '/administracion/tiendas',
        text: 'Tiendas',
        active: true,
      },
    ];

    res.render('admin/pages/stores/list.pug', {
      session: req.user,
      user: results.user,
      items: results.items,
      limit,
      page,
      count: results.count,
      q: req.query.q,
      title: 'Tiendas',
      menu: 'tiendas',
      xnew: '/administracion/tiendas/nuevo',
      breadcrumbs,
      js: 'admin',
    });
  });
};
