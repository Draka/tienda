module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['title', 'title']);
  body.tenancy = req.tenancy;

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      if (req.query.q) {
        body.$or = [
          { title: { $regex: req.query.q, $options: 'i' } },
          { slug: { $regex: req.query.q, $options: 'i' } },
        ];
      }
      return cb();
    },
    items: ['validate', (results, cb) => {
      models.Page
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          title: 1,
        })
        .lean()
        .exec(cb);
    }],
    count: ['validate', (_results, cb) => {
      models.Page
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
        link: '/administracion/super/paginas',
        text: 'Páginas',
        active: true,
      },
    ];

    res.render('../modules/pages/views/super/list.pug', {
      req,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Páginas',
      menu: 'super-paginas',
      xnew: '/administracion/super/paginas/nuevo',
      breadcrumbs,
    });
  });
};
