const { imagenUrl } = require('../../libs/image.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['title', 'multimediaID']);
  body.tenancy = req.tenancy;

  const limit = Math.min(Math.max(1, req.query.limit) || 40, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      if (req.query.q) {
        body.$or = [
          { title: { $regex: req.query.q, $options: 'i' } },
          { multimediaID: req.query.q },
        ];
      }
      return cb();
    },
    items: ['validate', (results, cb) => {
      models.Multimedia
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          title: 1,
        })
        .lean()
        .exec(cb);
    }],
    imagenUrl: ['items', (results, cb) => {
      imagenUrl(req, results.items, cb);
    }],
    count: ['validate', (_results, cb) => {
      models.Multimedia
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
        link: '/administracion/super/multimedia',
        text: 'Multimedia',
        active: true,
      },
    ];
    res.render('../modules/multimedia/views/super/list.pug', {
      req,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Multimedia',
      menu: 'super-multimedia',
      xnew: '/administracion/super/multimedia/nuevo',
      breadcrumbs,
      js: 'admin',
    });
  });
};
