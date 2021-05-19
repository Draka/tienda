const bcrypt = require('bcrypt');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
});

function comparePassword(password, field) {
  return new Promise((resolve, reject) => {
    if (!field) {
      return resolve(false);
    }
    bcrypt.compare(password, field, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
}

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'bank',
  ]);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (results, cb) => {
      models.User
        .findOne({
          tenancy: req.tenancy,
          _id: req.user._id,
        })
        .select({
          password: 1,
          passwordTemp: 1,
          bank: 1,
        })
        .exec(cb);
    }],
    checkPassword: ['query', (results, cb) => {
      Promise.all(['password', 'passwordTemp'].map((field) => comparePassword(req.body.password, results.query[field]))).then((rp) => {
        if (!rp[0] && !rp[1]) {
          errors.push({ field: 'password', msg: __('Contraseña inválida.') });
          return cb(listErrors(401, null, errors));
        }
        cb(null, true);
      }, (err) => cb(err));
    }],
    uploadFile: ['checkPassword', (results, cb) => {
      if (!req.files || !req.files.file) {
        errors.push({ field: 'file', msg: 'Adjunte el certificado de su cuenta.' });
      }
      if (req.files && req.files.file && ['application/pdf', 'image/jpeg'].indexOf(req.files.file.mimetype) === -1) {
        errors.push({ field: 'file', msg: 'Adjunte el certificado en formato pdf o jpg.' });
      }
      if (req.files && req.files.file && req.files.file.size / 1024 / 1024 > 10) {
        errors.push({ field: 'file', msg: 'El archivo debe ser menor a 10 megas.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }

      const dir = `./public/tenancy/${req.tenancy}/files/${appCnf.s3.folder}/users/${req.user._id}`;
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
        moveFile: ['makedirLocal', (results, cb) => {
          if (process.env.NODE_ENV === 'production') {
            // ajustes de s3
            const params = {
              Bucket: appCnf.s3.bucket,
              Key: `public/tenancy/${req.tenancy}/files/${appCnf.s3.folder}/users/${req.user._id}/bank`, // ruta donde va a quedar
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
            req.files.file.mv(`${dir}/bank`);
          }
          _.set(body, 'bank.file', `${dir}/bank`);
          _.set(body, 'bank.mime', req.files.file.mimetype);
          _.set(body, 'bank.fileCheck', true);
          _.set(body, 'bank.rejectMsg', '');
          body['check.bank.result'] = false;
          cb();
        }],
      }, cb);
    }],
    update: ['uploadFile', (results, cb) => {
      results.query.set(body).save(cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send({ status: true });
  });
};
