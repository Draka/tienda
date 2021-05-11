const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario/pedidos',
    text: 'Pedidos',
  },
  {
    link: '/usuario/ordenes/cancelar-confirmacion',
    text: 'Pedido Cancelado',
    active: true,
  },
];

const msg = {
  color: 'action',
  title: 'Pedido Cancelado',
  text: 'Se ha cancelado tu pedido.',
};

module.exports = (req, res) => {
  res.render('pages/messages/general.pug', {
    session: req.user,

    breadcrumbs,
    msg,
    js: 'page',
  });
};
