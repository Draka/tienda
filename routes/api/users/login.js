const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { detect } = require('detect-browser');

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

function generateToken(user, secret) {
  const payload = {
    iss: 'localhost',
    _id: user._id,
    admin: user.admin,
    adminStore: _.get(req, 'user.stores.admin') || false,
    iat: moment().unix(),
    exp: moment().add(1, 'years').unix(),
  };
  return jwt.sign(payload, secret);
}

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['email', 'password']);
  body.tenancy = req.tenancy;

  body.email = _.trim(body.email);
  async.auto({
    validate: (cb) => {
      if (!validator.isEmail(body.email)) {
        errors.push({ field: 'email', msg: __('Por favor, escribe una dirección de correo válida.') });
      }
      if (!body.password || body.password.length < global.minPassword) {
        errors.push({ field: 'password', msg: __('La contraseña debe tener al menos %s caracteres.', global.minPassword) });
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
          emailNormalized: validator.normalizeEmail(req.body.email),
        })
        .select({
          admin: 1,
          password: 1,
          passwordTemp: 1,
          personalInfo: 1,
          email: 1,
          stores: 1,
        })
        .exec(cb);
    }],
    token: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'email', msg: __('Correo electrónico o Contraseña inválidos.') });
        return cb(listErrors(401, null, errors));
      }
      Promise.all(['password', 'passwordTemp'].map((field) => comparePassword(req.body.password, results.query[field]))).then((rp) => {
        if (!rp[0] && !rp[1]) {
          errors.push({ field: 'email', msg: __('Correo electrónico o Contraseña inválidos.') });
          return cb(listErrors(401, null, errors));
        }
        cb(null, generateToken(results.query, appCnf.keySecret));
      }, (err) => cb(err));
    }],
    saveToken: ['token', (results, cb) => {
      // crea el cookie
      if (req.query.cookie) {
        res.cookie('token', results.token, {
          maxAge: moment().add(1, 'years').unix(),
          httpOnly: true,
          signed: true,
        });
      }
      // Guarda el token
      const browser = detect(req.headers['user.-agent']);
      models.Session.updateOne(
        {
          userID: results.query._id,
          ssid: req.body.ssid || 'apik',
        },
        {
          userID: results.query._id,
          ssid: req.body.ssid || 'apik',
          token: results.token,
          name: _.get(browser, 'name'),
          version: _.get(browser, 'version'),
          os: _.get(browser, 'os'),
          ip: req.headers['x-forwarded-for']
                        || req.connection.remoteAddress
                        || req.socket.remoteAddress
                        || (req.connection.socket ? req.connection.socket.remoteAddress : null),
          userAgent: browser ? '' : req.headers['user.-agent'],
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        }, cb,
      );
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    } if (!results.query) {
      return listErrors(401, res);
    }
    res.send({ token: results.token, user: _.pick(results.query, ['_id', 'email', 'personalInfo']) });
  });
};
