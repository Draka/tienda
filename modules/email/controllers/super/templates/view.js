const Handlebars = require('handlebars');

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
      const template = Handlebars.compile(results.item.html);
      const data = {
        source: {
          name: _.get(appCnf, 'site.email.title'),
          email: _.get(appCnf, 'site.email.emailInfo'),
        },
        replyToAddresses: [
          _.get(appCnf, 'site.email.emailNoreply'),
        ],
        site: {
          name: _.get(appCnf, 'site.name'),
          urlSite: appCnf.url.site,
          urlStatic: appCnf.url.static,
          info: _.get(appCnf, 'site.email.emailInfo'),
          title: _.get(appCnf, 'site.email.title'),
          color: _.get(appCnf, 'site.color'),
          logoEmail: _.get(appCnf, 'site.images.logoEmail.jpg'),
        },
        tenancy: appCnf.tenancy,
        v: appCnf.v,
      };
      results.item.html = template(data);
      const subject = Handlebars.compile(results.item.subject);
      results.item.subject = subject(data);
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
