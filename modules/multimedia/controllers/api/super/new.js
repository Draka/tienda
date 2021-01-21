const { imageToS3 } = require('../../../libs/image.lib');
const { makeid } = require('../../../../../libs/util.lib');
const modCnf = require('../../../modCnf');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    uploadFile: ['validate', (results, cb) => {
      if (!req.files || !req.files.images) {
        return cb();
      }
      if (!_.isArray(req.files.images)) {
        req.files.images = [req.files.images];
      }
      async.eachLimit(req.files.images, 5, (file, cb) => {
        const key = makeid(12);
        const originalExt = _.last(file.name.split('.'));
        async.auto({
          convert: (cb) => {
            const pathImg = `multimedia/${key}`;
            imageToS3(pathImg, key, file, modCnf.imagesSizes, cb);
          },
          save: ['convert', (results, cb) => {
            const files = [];
            if (file.mimetype === 'image/jpeg') {
              files.push('jpg');
              files.push('webp');
            } else {
              files.push(originalExt);
            }
            let sizes = [];
            if (['image/png', 'image/jpeg'].indexOf(file.mimetype) >= 0) {
              sizes = _.map(modCnf.imagesSizes, 'x');
            }
            const multimedia = new models.Multimedia({
              key,
              files,
              sizes,
            });
            multimedia.save(cb);
          }],

        }, cb);
      }, cb);
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
