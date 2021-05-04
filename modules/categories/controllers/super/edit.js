const query = require('../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    item: ['validate', (results, cb) => {
      models.Category
        .findOne({
          tenancy: req.tenancy,
          storeID: req.params.storeID,
          _id: req.params.categoryID,
        })
        .exec(cb);
    }],
    tree: ['validate', (results, cb) => {
      query.categoryTree(req, cb);
    }],
    items: ['tree', (results, cb) => {
      const items = [];
      query.treePush(results.tree, items);
      cb(null, items);
    }],
    check2: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'categoryID', msg: 'El registro no existe.' }]));
      }
      cb();
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
        link: `/administracion/super/categorias/${req.params.faqCategoryID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('../modules/categories/views/super/edit.pug', {
      req,
      item: results.item,
      items: results.items,
      title: 'Editar Categoría',
      menu: 'super-categorias',
      breadcrumbs,
      js: 'admin',
    });
  });
};
