const sqsMailer = require('../../../../libs/sqs-mailer.lib');

module.exports = (req, res, next) => {
  async.auto({
    store: (cb) => {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.storeID,
        })
        .exec(cb);
    },
    check: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      results.store.approveSend = true;
      results.store.save(cb);
    }],
    user: ['check', (results, cb) => {
      models.User
        .findOne({
          tenancy: req.tenancy,
          _id: results.store.userID,
        })
        .exec(cb);
    }],
    mailer: ['user', (results, cb) => {
      sqsMailer(req, {
        to: { email: results.user.email, name: results.user.personalInfo.name },
        template: 'client-approved-store',
      },
      results.create,
      cb);
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/administracion/tiendas');
  });
};
