const { api } = require('../../libs/api.lib');

module.exports = (req, res, next) => {
  async.auto({
    items: (cb) => {
      api('categories', cb);
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
        active: true,
      },
    ];

    const item = {
      seo: 'Centro de ayuda para instalar y configurar tu tienda online.',
    };

    res.render('../modules/email/views/common/landpage.pug', {
      req,
      item,
      items: results.items,
      title: 'Centro de Ayuda',
      breadcrumbs,
      js: 'page',
    });
  });
};
