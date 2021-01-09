const sqsMailer = require('../../../libs/sqs_mailer');

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['email', 'password']);
  body.personalInfo = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    callsign: req.body.callsign,
    cellphone: req.body.cellphone,
  };
  body.email = _.trim(body.email);
  body.emailNormalized = validator.normalizeEmail(body.email);

  async.auto({
    validate: (cb) => {
      if (!validator.isEmail(body.email)) {
        errors.push({ field: 'email', msg: __('Por favor, escribe una dirección de correo válida.') });
      }
      if (body.password && body.password.length < global.minPassword) {
        errors.push({ field: 'password', msg: __('La contraseña debe tener al menos %s caracteres.', global.minPassword) });
      }
      if ((_.get(body, 'personalInfo.firstname') || '').length < 3) {
        errors.push({ field: 'firstname', msg: __('Debe escribir un nombre válido') });
      }
      if ((_.get(body, 'personalInfo.lastname') || '').length < 3) {
        errors.push({ field: 'lastname', msg: __('Debe escribir un apellido válido') });
      }
      if (!body.personalInfo.callsign || (_.get(body, 'personalInfo.callsign') || '').length < 3) {
        errors.push({ field: 'callsign', msg: __('Debe escribir un indicativo válido') });
      }
      const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

      if (!body.personalInfo.cellphone || !re.test(`${_.get(body, 'personalInfo.callsign')}${_.get(body, 'personalInfo.cellphone')}` || '')) {
        errors.push({ field: 'cellphone', msg: __('Debe escribir un número de célular válido') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.User
        .find({ emailNormalized: body.emailNormalized })
        .exec(cb);
    }],
    check: ['query', (results, cb) => {
      if (results.query.length) {
        errors.push({ field: 'email', msg: __('Ya hay un usuario con este email.') });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    create: ['check', (_results, cb) => {
      const user = new models.User(body);
      user.save(cb);
    }],
    mailer: ['create', (results, cb) => {
      sqsMailer({
        to: { email: body.email, name: results.create.personalInfo.name },
        subject: `${__('Registro')}`,
        template: 'new-user',
      },
      results.create,
      cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(201).send(body);
  });
};
