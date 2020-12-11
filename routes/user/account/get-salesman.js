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
  res.render('pages/users/get-salesman', {
    title: 'Quiero empezar a vender',
    breadcrumbs,
    js: 'page',
  });
};
