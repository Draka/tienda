const { putS3LogoPath } = require('../../../libs/put_s3_path.lib');
const reference = require('../../../libs/reference.lib');

module.exports = (req, res, next) => {
  const body = _.pick(req.query, ['name']);

  const limit = Math.min(Math.max(1, req.query.limit) || 20, 500);
  const page = Math.max(0, req.query.page) || 0;

  async.auto({
    validate: (cb) => {
      body.userID = req.user._id;
      if (req.query.q) {
        body.$or = [
          { slug: { $regex: req.query.q, $options: 'i' } },
        ];
      }
      return cb();
    },
    orders: ['validate', (_results, cb) => {
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
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/usuario/pedidos',
        text: 'Pedidos',
        active: true,
      },
    ];

    res.render('pages/orders/list.pug', {
      session: req.user,
      items: results.orders,
      limit,
      page,
      count: results.count,
      title: 'Pedidos',
      breadcrumbs,
      wompi: true,
      js: 'page',
    });
  });
};
