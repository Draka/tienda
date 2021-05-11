const { categoryTree, treePush } = require('../../../libs/query.lib');

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
    tree: ['validate', (results, cb) => {
      categoryTree(cb);
    }],
    items: ['tree', (results, cb) => {
      const items = [];
      treePush(results.tree, items);
      cb(null, items);
    }],
    count: ['validate', (_results, cb) => {
      models.HelpCategory
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
        link: '/administracion/super/ayuda-categorias',
        text: 'Ayuda Categorías',
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help-categorias/list.pug', {
      req,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Ayuda Categorías',
      menu: 'super-ayuda-categorias',
      xnew: '/administracion/super/ayuda-categorias/nuevo',
      breadcrumbs,
    });
  });
};
