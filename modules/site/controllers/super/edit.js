const { site } = require('../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    site: (cb) => {
      site(cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (!results.site) {
      results.site = {};
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/sitio',
        text: `${results.site.name}`,
        active: true,
      },
    ];

    res.render('../modules/site/views/super/edit.pug', {
      req,
      item: results.site,
      title: 'Configuración',
      menu: 'super-site-config',
      edit: `/administracion/tiendas/${req.params.storeID}/editar`,
      breadcrumbs,
    });
  });
};
