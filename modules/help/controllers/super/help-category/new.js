const { categoryTree, treePush } = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    tree: ['validate', (results, cb) => {
      categoryTree(cb);
    }],
    items: ['tree', (results, cb) => {
      const items = [];
      treePush(results.tree, items);
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
        link: '/administracion/super/ayuda-categorias',
        text: 'Ayuda Categorías',
      },
      {
        link: '/administracion/super/ayuda-categorias/nuevo',
        text: 'Ayuda Categorías',
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help-categorias/new.pug', {
      req,
      items: results.items,
      title: 'Nueva Categoría',
      menu: 'super-ayuda-categorias',
      breadcrumbs,
      js: 'admin',
      cke: true,
    });
  });
};
