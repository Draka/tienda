const query = require('../../libs/query.lib');

module.exports = (req, res, next) => {
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
      },
      {
        link: '/administracion/super/categorias/nuevo',
        text: 'Nueva Categoría',
        active: true,
      },
    ];

    res.render('../modules/categories/views/super/new.pug', {
      req,
      items: results.items,
      title: 'Nueva Categoría',
      menu: 'super-categorias',
      breadcrumbs,
      js: 'admin',
    });
  });
};
