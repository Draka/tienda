module.exports = (req, res, next) => {
  const errors = [];
  const body = { personalInfo: _.pick(req.body, ['firstname', 'lastname', 'callsign', 'cellphone']) };
  async.auto({
    validate: (cb) => {
      if (!body.personalInfo.firstname || (_.get(body, 'personalInfo.firstname') || '').length < 3) {
        errors.push({ field: 'firstname', msg: __('Debe escribir un nombre válido') });
      }
      if (!body.personalInfo.lastname || (_.get(body, 'personalInfo.lastname') || '').length < 3) {
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
    query: ['validate', (results, cb) => {
      models.User
        .findById(req.user._id)
        .select({
          personalInfo: 1,
        })
        .exec(cb);
    }],
    update: ['query', (results, cb) => {
      results.query.set(body).save(cb);
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(201).send({ status: true });
  });
};
