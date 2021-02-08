module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.EmailTemplate
        .findById(req.params.emailTemplateID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'emailTemplateID', msg: 'No existe la Plantilla' }]));
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
        link: `/administracion/super/emails-plantillas/${req.params.emailTemplateID}/ver`,
        text: `Ver - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('../modules/email/views/super/templates/view.pug', {
      session: req.user,
      item: results.item,
      title: `Ver - ${results.item.name}`,
      menu: 'super-emails-plantillas',
      breadcrumbs,
      js: 'admin',
      cke: true,
      edit: `/administracion/super/emails-plantillas/${req.params.emailTemplateID}/editar`,
    });
  });
};
