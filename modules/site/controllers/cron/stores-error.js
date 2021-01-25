const { checkStore } = require('../../libs/check-store.lib');
const sqsMailer = require('../../../../libs/sqs_mailer');

module.exports = (req, res, next) => {
  async.auto({
    query: (cb) => {
      models.Store
        .find({
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
    mailer: ['check', (results, cb) => {
      async.eachLimit(results.query, 10, (store, cb) => {
        sqsMailer({
          noNow: true,
          to: { email: store.userID.email, name: store.userID.personalInfo.name },
          subject: 'Completa la información de tu tienda',
          template: 'msg-general',
          msg: `<p>El equipo de ${appCnf.site.name} agradece el uso de su aplicación.</p>`
          + '<p>Con nuestro compromiso de tener una calidad de tiendas publicadas hemos encontrado unos errores que debe ser corregidos en brevedad.</p>'
          + `<p>Ingrese a ${appCnf.site.url} en la lista de tiendas, aparecerá en un icono rojo los problemas y una explicación de como corregirlos.</p>`
          + `<p>Si tiene dudas puede contactar directamente a Whatsapp: ${(_.find(appCnf.site.contacts, { slug: 'whatsapp' })).value}.</p>`,
        },
        { _id: store.userID._id },
        cb);
      }, cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
