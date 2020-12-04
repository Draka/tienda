const query = require('../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, global.session);
    },
    store: ['user', (results, cb) => {
      query.store(req.params.storeID, cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
      }
      if (results.user.admin) {
        return cb();
      }
      if (results.user.id === results.store.userID) {
        return cb();
      }
      return cb(listErrors(401, null, [{ field: 'storeID', msg: 'No puedes ver esta tienda' }]));
    }],
    tree: ['check', (results, cb) => {
      query.categoryTree(req.params.storeID, cb);
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
        link: '/administracion/tiendas',
        text: 'Tiendas',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}`,
        text: `${results.store.name}`,
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/productos`,
        text: 'Productos',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/productos/nuevo`,
        text: 'Nuevo',
        active: true,
      },
    ];

    res.render('admin/pages/products/new.pug', {
      user: results.user,
      store: results.store,
      items: results.items,
      title: 'Nuevo Producto',
      menu: 'tienda-productos-nuevo',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
