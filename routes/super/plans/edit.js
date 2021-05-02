module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Plan
        .findById(req.params.planID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'planID', msg: 'No existe el Plan' }]));
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
        link: `/administracion/super/planes/editar/${req.params.planID}`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('admin/pages/super-plans/edit.pug', {
      req,
      item: results.item,
      title: 'Editar Plan',
      menu: 'super-planes',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
