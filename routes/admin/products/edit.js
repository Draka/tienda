const query = require('../../../libs/query.lib');
const { putS3Path } = require('../../../libs/put_s3_path.lib');

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
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe la tienda' }]));
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
      models.Product
        .findOne({
          storeID: req.params.storeID,
          _id: req.params.productID,
        })
        .populate({
          path: 'groups.productIDs',
          select: 'name,sku,features',
        })
        .exec(cb);
    }],
    postFind: ['item', (results, cb) => {
      putS3Path([results.item], results.store);
      cb();
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
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'No existe el Producto' }]));
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
        link: `/administracion/tiendas/${req.params.storeID}/productos`,
        text: 'Productos',
      },
      {
        link: `/administracion/tiendas/${req.params.storeID}/productos/${req.params.productID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/products/edit.pug', {
      req,
      user: results.user,
      store: results.store,
      item: results.item,
      items: results.items,
      title: 'Editar Producto',
      menu: 'tienda-productos',
      breadcrumbs,
      cke: true,
      js: 'admin',
      back: `/administracion/tiendas/${req.params.storeID}/productos`,
    });
  });
};
