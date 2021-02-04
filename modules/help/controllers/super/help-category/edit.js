const { categoryTree, treePush } = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.HelpCategory
        .findById(req.params.helpCategoryID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'helpCategoryID', msg: 'No existe la Categoría' }]));
      }
      cb();
    }],
    tree: ['check', (results, cb) => {
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
        link: `/administracion/super/ayuda-categorias/${req.params.helpCategoryID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help-categorias/edit.pug', {
      session: req.user,
      item: results.item,
      items: results.items,
      title: `Editar - ${results.item.name}`,
      menu: 'super-help-categorias',
      breadcrumbs,
      js: 'admin',
      cke: true,
    });
  });
};
