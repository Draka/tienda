const { site } = require('../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    site: (cb) => {
      site(cb);
    },
    images: ['site', (results, cb) => {
      if (results.site) {
        _.each(results.site.images, (image, path) => {
          _.each(image, (url, ext) => {
            results.site.images[path][ext] = `${appCnf.url.static}tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/site/${path}/${url}`;
          });
        });
      }
      cb();
    }],
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
      session: req.user,
      item: results.site,
      title: 'Configuración',
      menu: 'super-site-config',
      edit: `/administracion/tiendas/${req.params.storeID}/editar`,
      breadcrumbs,
    });
  });
};
