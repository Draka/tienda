const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      if (results.user.admin) {
        return cb();
      }
      if (results.user._id.toString() === results.store.userID.toString()) {
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
    }],
    item: ['check', (results, cb) => {
      models.Category
        .findOne({ tenancy: req.tenancy,
          storeID: req.params.storeID,
          _id: req.params.categoryID,
        })
        .exec(cb);
    }],
    tree: ['check', (results, cb) => {
      query.categoryTree(req.params.storeID, cb);
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
        link: '/administracion/tiendas',
        text: 'Tiendas',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/categorias`,
        text: 'Categorías',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/categorias/${req.params.categoryID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/categories/edit.pug', {
      req,
      user: results.user,
      store: results.store,
      items: results.items,
      item: results.item,
      title: 'Editar Categoría',
      menu: 'tienda-categorias',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
