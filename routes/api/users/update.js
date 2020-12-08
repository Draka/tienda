const bcrypt = require('bcrypt-nodejs');

function comparePassword(password, field) {
  return new Promise((resolve, reject) => {
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
  const body = _.pick(req.body, ['password', 'newPassword', 'personalInfo']);
  if (!body.password) {
    body.personalInfo = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      cellphone: req.body.cellphone,
    };
  }

  async.auto({
    validate: (cb) => {
      if (body.newPassword && body.newPassword.length < global.minPassword) {
        errors.push({ field: 'password', msg: __('La contraseña nueva debe tener al menos %s caracteres', global.minPassword) });
      }
      if (!body.password) {
        if (body.personalInfo.firstname && (_.get(body, 'personalInfo.firstname') || '').length < 3) {
          errors.push({ field: 'firstname', msg: __('Debe escribir un nombre válido') });
        }
        if (body.personalInfo.lastname && (_.get(body, 'personalInfo.lastname') || '').length < 3) {
          errors.push({ field: 'lastname', msg: __('Debe escribir un apellido válido') });
        }
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        if (body.personalInfo.cellphone && !re.test(_.get(body, 'personalInfo.cellphone') || '')) {
          errors.push({ field: 'cellphone', msg: __('Debe escribir un número de célular válido') });
        }
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (results, cb) => {
      models.User
        .findById(req.user._id)
        .select({
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
          errors.push({ field: 'password', msg: __('Contraseña inválida.') });
          return cb(listErrors(401, null, errors));
        }
        body.password = body.newPassword;
        body.passwordTemp = '';

        cb(null, true);
      }, (err) => cb(err));
    }],
    update: ['checkPassword', (results, cb) => {
      results.query.set(body).save(cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(201).send({ status: true });
  });
};
