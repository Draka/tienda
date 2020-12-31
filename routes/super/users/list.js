module.exports = (req, res, next) => {
  const query = _.pick(req.query, ['email']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  if (req.query.q) {
    const q = _.deburr(_.trim(req.query.q));
    query.$or = [
      { email: { $regex: q, $options: 'i' } },
      { emailNormalized: { $regex: q, $options: 'i' } },
      { 'personalInfo.name': { $regex: q, $options: 'i' } },
      { 'personalInfo.cellphone': { $regex: q, $options: 'i' } },
      { 'personalInfo.allCellphone': { $regex: q, $options: 'i' } },
    ];
  }

  async.auto({
    validate: (cb) => cb(),
    users: ['validate', (results, cb) => {
      models.User
        .find(query)
        .limit(limit)
        .skip(limit * page)
        .sort({
          name: 1,
        })
        .lean()
        .exec(cb);
    }],
    count: ['validate', (_results, cb) => {
      models.User
        .countDocuments(query)
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
        link: '/administracion/super/usuarios',
        text: 'Usuarios',
        active: true,
      },
    ];

    res.render('admin/pages/super-users/list.pug', {
      session: req.user,
      items: results.users,
      limit,
      page,
      count: results.count,
      title: 'Usuarios',
      menu: 'super-usuarios-lista',
      breadcrumbs,
    });
  });
};