module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Multimedia
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.multimediaID,
        })
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'multimediaID', msg: 'El registro no existe.' }]));
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
        link: '/administracion/super/multimedia',
        text: 'Multimedia',
      },
      {
        link: `/administracion/super/multimedia/editar/${req.params.multimediaID}`,
        text: `Editar - ${results.item.title || 'Sin Título'}`,
        active: true,
      },
    ];

    res.render('../modules/multimedia/views/super/edit.pug', {
      req,
      item: results.item,
      title: 'Editar Multimedia',
      menu: 'super-multimedia',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
