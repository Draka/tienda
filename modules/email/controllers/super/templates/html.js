module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.EmailTemplate
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.emailTemplateID,
        })
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'emailTemplateID', msg: 'El registro no existe.' }]));
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
        link: '/administracion/super/emails-plantillas',
        text: 'Email Plantillas',
      },
      {
        link: `/administracion/super/emails-plantillas/${req.params.emailTemplateID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('../modules/email/views/super/templates/html.pug', {
      req,
      item: results.item,
      title: `Editar - ${results.item.name}`,
      menu: 'super-emails-plantillas',
      breadcrumbs,
      js: 'admin',
      cke: true,
    });
  });
};
