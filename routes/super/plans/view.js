module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Plan
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.planID,
        })
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'planID', msg: 'El registro no existe.' }]));
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
        link: '/administracion/super/planes',
        text: 'Plans',
      },
      {
        link: `/administracion/super/planes/${req.params.planID}`,
        text: `Detalle - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/super-plans/view.pug', {
      req,
      item: results.item,
      title: 'Ver Plan',
      menu: 'super-planes',
      edit: `/administracion/super/planes/editar/${req.params.planID}`,
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
