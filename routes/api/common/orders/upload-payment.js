const fs = require('fs');
const sqsMailer = require('../../../../libs/sqs-mailer.lib');
const reference = require('../../../../libs/reference.lib');
const { orderToMail } = require('../../../../libs/util.lib');

const s3 = new AWS.S3({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
});

module.exports = (req, res, next) => {
  const errors = [];
  let ext = '';
  async.auto({
    validate: (cb) => {
      cb();
    },
    order: ['validate', (_results, cb) => {
      models.Order
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.orderID,
          userID: req.user._id,
        })
        .exec(cb);
    }],
    check: ['order', (results, cb) => {
      if (!results.order) {
        errors.push({ field: 'order', msg: 'El registro no existe.' });
        return next(listErrors(404, null, errors));
      }
      if (results.order.status !== 'created' || !results.order.payment.pse) {
        errors.push({ field: 'reference', msg: 'Esta orden no necesita pago' });
        return cb(listErrors(400, null, errors));
      }
      cb();
    }],
    reference: ['order', (results, cb) => {
      reference(req, results.order, req.user._id, cb);
    }],
    uploadFile: ['check', 'reference', (results, cb) => {
      if (!results.reference || results.reference.status === 'approved') {
        errors.push({ field: 'reference', msg: 'Esta orden no necesita pago' });
        return cb(listErrors(400, null, errors));
      }
      if (!req.files || !req.files.file) {
        errors.push({ field: 'file', msg: 'Adjunte el comprobante de pago.' });
      }
      if (req.files && req.files.file && ['application/pdf', 'image/jpeg', 'image/png'].indexOf(req.files.file.mimetype) === -1) {
        errors.push({ field: 'file', msg: 'Adjunte el certificado en formato pdf, jpg o png.' });
      }
      if (req.files && req.files.file && req.files.file.size / 1024 / 1024 > 10) {
        errors.push({ field: 'file', msg: 'El archivo debe ser menor a 10 megas.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      switch (req.files.file.mimetype) {
        case 'application/pdf':
          ext = '.pdf';
          break;
        case 'image/jpeg':
          ext = '.jpg';
          break;
        case 'image/png':
          ext = '.png';
          break;
        default:
      }

      const dir = `./public/tenancy/${req.tenancy}/files/${appCnf.s3.folder}/orders/${req.params.orderID}/${results.reference._id}`;
      async.auto({
        makedirLocal: (cb) => {
          if (process.env.NODE_ENV === 'production') {
            return cb();
          }
          if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true }, cb);
          } else {
            cb();
          }
        },
        moveFile: ['makedirLocal', (_results, cb) => {
          if (process.env.NODE_ENV === 'production') {
            // ajustes de s3
            const params = {
              Bucket: appCnf.s3.bucket,
              Key: `tenancy/${req.tenancy}/files/${appCnf.s3.folder}/orders/${req.params.orderID}/${results.reference._id}/payment${ext}`, // ruta donde va a quedar
              Body: req.files.file.data,
              ContentType: req.files.file.mimetype,
              CacheControl: 'private, max-age=31536000',
              Expires: moment.tz().add(1, 'year').unix(),
              ACL: 'private',
              StorageClass: 'INTELLIGENT_TIERING',
            };
            // sube el archivo
            s3.upload(params, cb);
          } else {
            cb();
          }
        }],
        moveFileLocal: ['makedirLocal', (_results, cb) => {
          if (process.env.NODE_ENV !== 'production') {
            req.files.file.mv(`${dir}/payment${ext}`);
          }
          results.order.payment.file = `${results.reference._id}/payment${ext}`;
          results.reference.sentAt = new Date();
          results.reference.file = `payment${ext}`;
          results.reference.mime = req.files.file.mimetype;
          results.reference.fileCheck = true;
          results.reference.rejectMsg = '';
          cb();
        }],
      }, cb);
    }],
    update: ['uploadFile', (results, cb) => {
      results.order.status = 'verifying';
      results.order.statuses.push({
        status: 'verifying',
      });
      results.order.save(cb);
    }],
    updateReference: ['uploadFile', (results, cb) => {
      results.reference.status = 'approved';
      results.reference.save(cb);
    }],
    mailerAdmin: ['update', (results, cb) => {
      results.order.populate({
        path: 'storeID',
        select: 'name slug approve publish',
        populate: {
          path: 'userID',
          select: 'email personalInfo',
        },
      }, () => {
        const admin = _.get(results.order, 'storeID.userID');
        if (admin) {
          if (results.order.status === 'verifying') {
            const orderFormat = orderToMail(results.order);
            sqsMailer(req, {
              to: { email: admin.email, name: _.get(admin, 'personalInfo.name') },
              template: 'seller-new-order',
              order: orderFormat,
            },
            admin,
            cb);
          } else {
            cb();
          }
        } else {
          cb();
        }
      });
    }],
    mailerClient: ['update', (results, cb) => {
      const orderFormat = orderToMail(results.order);

      sqsMailer(req, {
        to: { email: results.order.userData.email, name: _.get(results.order, 'user.Data.name') },
        template: 'client-new-order',
        order: orderFormat,
      },
      { _id: results.order.userID },
      cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(_.pick(results.order, ['_id', 'status']));
  });
};
