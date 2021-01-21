const { deleteS3 } = require('../../../libs/image.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Multimedia
        .findById(req.params.multimediaID)
        .exec(cb);
    }],
    deleteS3: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'No existe el Archivo Multimedia.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      deleteS3(`tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/multimedia/${results.query.key}`, cb);
    }],
    delete: ['query', (results, cb) => {
      models.Multimedia
        .findByIdAndDelete(req.params.multimediaID)
        .exec(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
