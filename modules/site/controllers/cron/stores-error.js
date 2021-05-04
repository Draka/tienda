const { checkStore } = require('../../libs/check-store.lib');
const sqsMailer = require('../../../../libs/sqs_mailer');

module.exports = (req, res, next) => {
  async.auto({
    query: (cb) => {
      models.Store
        .find({ tenancy: req.tenancy,
          publish: true,
        })
        .populate({
          path: 'userID',
          select: 'personalInfo email',
        })
        .exec(cb);
    },
    check: ['query', (results, cb) => {
      async.eachLimit(results.query, 10, (store, cb) => {
        checkStore(store, cb);
      }, cb);
    }],
    // mailer: ['check', (results, cb) => {
    //   async.eachLimit(results.query, 10, (store, cb) => {
    //     sqsMailer({
    //       noNow: true,
    //       to: { email: store.userID.email, name: store.userID.personalInfo.name },
    //       subject: 'Completa la información de tu tienda',
    //       template: 'msg-general',
    //       msg: `<p>Desde el equipo de ${appCnf.site.name} agradecemos el uso de nuestra aplicación.</p>`
    //       + `<p>Hemos encontrado algunos errores que deben ser corregidos en brevedad. Por favor, Ingresa a ${appCnf.site.url}`
    //       + ' y en la lista de tiendas aparecerá con un ícono rojo los problemas encontrados y una explicación de cómo puedes corregirlos.</p>'
    //       + `<p>En ${appCnf.site.name} estamos comprometidos con la calidad de las tiendas aliadas que trabajan con nosotros,`
    //       + ' recuerda que si tienes dudas adicionales, puedes contactarnos directamente por WhatsApp en el número'
    //       + ` ${(_.find(appCnf.site.contacts, { slug: 'whatsapp' })).value}.</p>`,
    //     },
    //     { _id: store.userID._id },
    //     cb);
    //   }, cb);
    // }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
