module.exports = (req, res, next) => {
  const start = moment.tz(global.tz).startOf('day').subtract('week', 1);
  const end = moment.tz(global.tz);// .startOf('day');

  async.auto({
    newProducts: (cb) => {
      models.Product
        .find({
          createdAt: {
            $lt: end.toDate(),
          },
          publish: true,
        })
        .select('_id')
        .sort({ createdAt: -1 })
        .limit(20)
        .exec(cb);
    },
    newProductsReset: ['newProducts', (results, cb) => {
      models.ProductList
        .updateMany({
          slug: 'new-products',
          last: true,
        },
        { last: false }, cb);
    }],
    newProductsPost: ['newProductsReset', (results, cb) => {
      _.each(results.newProducts, (doc, i) => {
        models.ProductList({
          tenancy: req.tenancy,
          slug: 'new-products',
          last: true,
          date: `${end.format('YYYY-MM-DD')}`,
          dateStart: start.toDate(),
          dateEnd: end.toDate(),
          order: i,
          productID: doc._id,
        }).save();
      });
      cb();
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
