module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['title', 'title']);

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
      models.Document
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
      models.Document
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
        link: '/administracion/super/documentos',
        text: 'Documentos',
        active: true,
      },
    ];

    res.render('admin/pages/super-documents/list.pug', {
      session: req.user,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Documentos',
      menu: 'super-documentos',
      xnew: '/administracion/super/documentos/nuevo',
      breadcrumbs,
    });
  });
};
