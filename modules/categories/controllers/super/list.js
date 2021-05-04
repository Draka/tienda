const query = require('../../libs/query.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);
  body.tenancy = req.tenancy;

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => cb(),
    tree: ['validate', (results, cb) => {
      query.categoryTree(req, cb);
    }],
    items: ['tree', (results, cb) => {
      const items = [];
      query.treePush(results.tree, items);
      cb(null, items);
    }],
    count: ['validate', (_results, cb) => {
      models.Category
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
        link: '/administracion/super/categorias',
        text: 'Categorías',
        active: true,
      },
    ];

    res.render('../modules/categories/views/super/list.pug', {
      req,
      items: results.items,
      limit,
      page,
      count: results.count,
      title: 'Categorías',
      menu: 'super-categorias',
      xnew: '/administracion/super/categorias/nuevo',
      breadcrumbs,
      js: 'admin',
    });
  });
};
