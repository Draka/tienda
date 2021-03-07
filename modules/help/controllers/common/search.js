const { api } = require('../../libs/api.lib');

module.exports = (req, res, next) => {
  async.auto({
    items: (cb) => {
      api(`categories?q=${req.query.q}`, cb);
    },
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
        link: '/ayuda',
        text: 'Centro de Ayuda',
      },
      {
        link: '/ayuda/buscar',
        text: 'Buscar',
        active: true,
      },
    ];

    const item = {
      seo: 'Usa el formulario de buscar o su campo de texto para navegar y encontrar tópicos de nuestra sección de ayuda',
    };

    res.render('../modules/help/views/common/search.pug', {
      session: req.user,
      item,
      items: results.items,
      title: 'Centro de Ayuda',
      breadcrumbs,
      js: 'page',
      q: req.query.q,
    });
  });
};
