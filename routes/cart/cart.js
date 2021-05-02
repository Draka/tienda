module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.render('pages/cart/cart', {
      req,
      title: 'Carrito de compras',
      js: 'cart',
    });
  });
};
