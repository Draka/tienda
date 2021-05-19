const bcrypt = require('bcrypt');

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
  const body = _.pick(req.body, ['password', 'email']);

  async.auto({
    validate: (cb) => {
      if (!validator.isEmail(body.email)) {
        errors.push({ field: 'email', msg: __('Por favor, escribe una dirección de correo válida.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (results, cb) => {
      models.User
        .findOne({
          tenancy: req.tenancy,
          _id: req.user._id,
        })
        .select({
          email: 1,
          password: 1,
          passwordTemp: 1,
          personalInfo: 1,
        })
        .exec(cb);
    }],
    checkPassword: ['query', (results, cb) => {
      if (!body.password) {
        return cb(null, true);
      }
      Promise.all(['password', 'passwordTemp'].map((field) => comparePassword(req.body.password, results.query[field]))).then((rp) => {
        if (!rp[0] && !rp[1]) {
          errors.push({ field: 'password', msg: 'Contraseña inválida.' });
          return cb(listErrors(401, null, errors));
        }
        body.passwordTemp = '';

        cb(null, true);
      }, (err) => cb(err));
    }],
    queryEmail: ['query', (results, cb) => {
      if (results.query.email === body.email) {
        errors.push({ field: 'email', msg: 'Mismo email.' });
        return cb(listErrors(409, null, errors));
      }
      models.User
        .find({
          tenancy: req.tenancy,
          emailNormalized: body.emailNormalized,
        })
        .exec(cb);
    }],
    checkEmail: ['queryEmail', (results, cb) => {
      if (results.query.length) {
        errors.push({ field: 'email', msg: 'Ya hay un usuario con este email.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    update: ['checkEmail', (results, cb) => {
      results.query.set(body).save(cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(201).send({ status: true });
  });
};
