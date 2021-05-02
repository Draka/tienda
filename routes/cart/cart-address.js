module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.render('pages/cart/cart-address', {
      req,
      title: __('Carrito de compras -> Confirmar Dirección'),
      js: 'cart',
      osm: true,
    });
  });
};
