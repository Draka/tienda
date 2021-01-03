module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Document
        .findById(req.params.documentID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'documentID', msg: 'No existe el Documento' }]));
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
        link: '/administracion/super/documentos',
        text: 'Documentos',
      },
      {
        link: `/administracion/super/documentos/editar/${req.params.documentID}`,
        text: `Editar - ${results.item.title}`,
        active: true,
      },
    ];

    res.render('admin/pages/super-documents/edit.pug', {
      session: req.user,
      item: results.item,
      title: 'Editar Documento',
      menu: 'tienda-documentos',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
