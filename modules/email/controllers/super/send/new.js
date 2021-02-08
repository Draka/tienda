const { modelAll } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    templates: (cb) => modelAll('EmailTemplate', cb),
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
        link: '/administracion/super/emails-enviar',
        text: 'Enviar Email',
        active: true,
      },
    ];

    res.render('../modules/email/views/super/send/new.pug', {
      session: req.user,
      templates: results.templates,
      title: 'Nueva Plantilla',
      menu: 'super-emails-enviar',
      breadcrumbs,
      js: 'admin',
      cke: true,
    });
  });
};
