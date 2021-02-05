module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

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
      models.EmailTemplate
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          title: 1,
        })
        .populate({
          path: 'categoryID',
          select: 'name',
        })
        .lean()
        .exec(cb);
    }],
    count: ['validate', (_results, cb) => {
      models.EmailTemplate
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
        link: '/administracion/super/emails-plantillas',
        text: 'Email Plantillas',
        active: true,
      },
    ];

    res.render('../modules/email/views/super/templates/list.pug', {
      session: req.user,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Email Plantillas',
      menu: 'super-emails-plantillas',
      xnew: '/administracion/super/emails-plantillas/nuevo',
      breadcrumbs,
    });
  });
};
