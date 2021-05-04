module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);
  body.tenancy = req.tenancy;

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      if (req.query.q) {
        body.$or = [
          { name: { $regex: req.query.q, $options: 'i' } },
          { slug: { $regex: req.query.q, $options: 'i' } },
        ];
      }
      return cb();
    },
    items: ['validate', (results, cb) => {
      models.FaqCategory
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
      models.FaqCategory
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
        link: '/administracion/super/faq-categorias',
        text: 'FAQ Categorías',
        active: true,
      },
    ];

    res.render('../modules/faq/views/super/faq-categorias/list.pug', {
      req,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'FAQ Categorías',
      menu: 'super-faq-categorias',
      xnew: '/administracion/super/faq-categorias/nuevo',
      breadcrumbs,
    });
  });
};
