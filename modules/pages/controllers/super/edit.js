module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Page
        .findById(req.params.pageID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'pageID', msg: 'No existe la Página' }]));
      }
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/paginas',
        text: 'Páginas',
      },
      {
        link: `/administracion/super/paginas/editar/${req.params.pageID}`,
        text: `Editar - ${results.item.title}`,
        active: true,
      },
    ];

    res.render('../modules/pages/views/super/edit.pug', {
      req,
      item: results.item,
      title: 'Editar Página',
      menu: 'super-paginas',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
