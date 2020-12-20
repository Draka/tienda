/* eslint-disable global-require */
module.exports = (app) => {
  app.get('/doc/politica-de-privacidad-y-tratamiento-de-datos', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/doc/politica-de-privacidad-y-tratamiento-de-datos',
        text: 'Política de Privacidad y Tratamiento de Datos',
        active: true,
      },
    ];
    res.render('pages/documents/politica-de-privacidad-y-tratamiento-de-datos', {
      session: req.user,
      title: 'Política de Privacidad y Tratamiento de Datos',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/doc/terminos-y-condiciones-cliente', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/doc/terminos-y-condiciones-cliente',
        text: 'Términos y Condiciones Cliente',
        active: true,
      },
    ];
    res.render('pages/documents/terminos-y-condiciones-cliente', {
      session: req.user,
      title: 'Términos y Condiciones Cliente',
      breadcrumbs,
      js: 'page',
    });
  });
  app.get('/doc/terminos-y-condiciones-vendedor', (req, res) => {
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/doc/terminos-y-condiciones-vendedor',
        text: 'Términos y Condiciones Vendedor',
        active: true,
      },
    ];
    res.render('pages/documents/terminos-y-condiciones-vendedor', {
      session: req.user,
      title: 'Términos y Condiciones Vendedor',
      breadcrumbs,
      js: 'page',
    });
  });
};
