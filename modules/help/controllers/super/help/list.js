module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['question', 'answer']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      if (req.query.q) {
        body.$or = [
          { question: { $regex: req.query.q, $options: 'i' } },
          { answer: { $regex: req.query.q, $options: 'i' } },
          { slug: { $regex: req.query.q, $options: 'i' } },
        ];
      }
      return cb();
    },
    items: ['validate', (results, cb) => {
      models.Help
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
      models.Help
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
        link: '/administracion/super/ayuda',
        text: 'Ayuda',
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help/list.pug', {
      session: req.user,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Ayuda',
      menu: 'super-help',
      xnew: '/administracion/super/ayuda/nuevo',
      breadcrumbs,
    });
  });
};
