const Handlebars = require('handlebars');

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
      const template = Handlebars.compile(results.item.html);
      const data = {
        source: {
          name: _.get(req, 'site.email.title'),
          email: _.get(req, 'site.email.emailInfo'),
        },
        replyToAddresses: [
          _.get(req, 'site.email.emailNoreply'),
        ],
        site: {
          name: _.get(req, 'site.name'),
          urlSite: _.get(req, 'site.url'),
          urlStatic: appCnf.url.cdn,
          info: _.get(req, 'site.email.emailInfo'),
          title: _.get(req, 'site.email.title'),
          color: _.get(req, 'site.color'),
          logoEmail: _.get(req, 'site.images.logoEmail.jpg'),
        },
        tenancy: req.tenancy,
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
      req,
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
