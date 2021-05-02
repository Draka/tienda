const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');
const reference = require('../../../libs/reference.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['orderID']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      body.status = {
        $in: ['verifying', 'paid', 'cancelled', 'cancelledAdmin', 'picking', 'ready', 'onway', 'arrived', 'missing', 'completed'],
      };
      // if (req.query.q) {
      //   body.$or = [
      //     { orderID: { $regex: req.query.q, $options: 'i' } },
      //   ];
      // }
      return cb();
    },
    stores: ['validate', (results, cb) => {
      models.Store
        .find({ userID: req.user._id })
        .lean()
        .exec(cb);
    }],
    orders: ['stores', (results, cb) => {
      body.storeID = { $in: _.map(results.stores, '_id') };
      models.Order
        .find(body)
        .limit(limit)
        .skip(limit * page)
        .sort({
          createdAt: -1,
        })
        .lean()
        .exec(cb);
    }],
    payment: ['orders', (results, cb) => {
      async.eachLimit(results.orders, 10, (order, cb) => {
        order.store._id = order.storeID;
        putS3LogoPath([order.store]);
        reference(order, req.user._id, cb);
      }, cb);
    }],
    count: ['validate', (_results, cb) => {
      models.Order
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
        link: '/administracion/tiendas',
        text: 'Tiendas',
      },
      {
        link: '/administracion/tiendas/pedidos',
        text: 'Pedidos',
        active: true,
      },
    ];

    res.render('admin/pages/orders/list.pug', {
      session: req.user,
      items: results.orders,
      limit,
      page,
      count: results.count,
      title: 'Pedidos',
      menu: 'pedidos-lista',
      breadcrumbs,
      js: 'admin',
    });
  });
};
