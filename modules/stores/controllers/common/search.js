const { putS3LogoPath } = require('../../../../libs/put_s3_path.lib');

module.exports = (req, res, next) => {
  const limit = Math.min(Math.max(1, req.query.limit) || 42, 500);
  const page = Math.max(0, req.query.page) || 0;

  const query = {
    publish: 1,
    approve: 1,
  };

  if (req.query.q) {
    const q = _.deburr(_.trim(req.query.q));
    query.$or = [
      { slug: { $regex: q, $options: 'i' } },
      { seo: { $regex: q, $options: 'i' } },
      { descriptionLong: { $regex: q, $options: 'i' } },
      { primaryActivity: { $regex: q, $options: 'i' } },
      { secondaryActivity: { $regex: q, $options: 'i' } },
    ];
  }

  async.auto({
    stores: (cb) => {
      models.Store
        .find(query)
        .limit(limit)
        .skip(limit * page)
        .sort({
          updateAt: -1,
        })
        .lean()
        .exec(cb);
    },
    postFind: ['stores', (results, cb) => {
      putS3LogoPath(req, results.stores);
      cb();
    }],
    count: ['postFind', (_results, cb) => {
      models.Store
        .countDocuments(query)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/tiendas',
        text: 'Tiendas',
      },
      {
        link: '/tiendas/buscar',
        text: 'Buscar',
        active: true,
      },
    ];

    const item = {
      seo: 'Usa el formulario de buscar o su campo de texto para navegar y encontrar tiendas',
    };

    res.render('../modules/stores/views/common/search.pug', {
      req,
      item,
      stores: results.stores,
      title: 'Buscar Tiendas',
      limit,
      page,
      count: results.count,
      breadcrumbs,
      js: 'page',
      q: req.query.q,
    });
  });
};
