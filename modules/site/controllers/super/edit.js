module.exports = (req, res, next) => {
  async.auto({
    site: (cb) => {
      models.Site
        .findOne({ tenancy: req.tenancy,
          tenancy: req.tenancy,
        })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          _.each(_.get(doc, 'images'), (image, path) => {
            _.each(image, (url, ext) => {
              doc.images[path][ext] = `${appCnf.url.cdn}tenancy/${req.tenancy}/images/${appCnf.s3.folder}/site/${path}/${url}`;
            });
          });
          cb(null, doc);
        });
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
      breadcrumbs,
    });
  });
};
