module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    }
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.render('pages/cart/cart-finish', { title: __('Carrito de compras -> Resumen pedido'), js: 'cart', wompi: true });
  });
};