const breadcrumbs = [
  {
    link: '/',
    text: 'Inicio',
  },
  {
    link: '/usuario/vendedor',
    text: 'Ser vendedor',
    active: true,
  },
];

module.exports = (req, res) => {
  res.render('pages/common/get-salesman', {
    req,
    title: 'Quiero empezar a vender',
    breadcrumbs,
    js: 'page',
  });
};
