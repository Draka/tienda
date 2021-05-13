const { imageToS3, imagenUrl } = require('../../../libs/image.lib');
const { makeid } = require('../../../../../libs/util.lib');
const modCnf = require('../../../modCnf');

module.exports = (req, res, next) => {
  if (_.get(req, 'files.upload')) {
    _.get(req, 'files.images', req.files.upload);
  }
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
      async.mapLimit(req.files.images, 5, (file, cb) => {
        const key = makeid(12);
        const originalExt = _.last(file.name.split('.'));
        async.auto({
          convert: (cb) => {
            const pathImg = `multimedia/${key}`;
            imageToS3(req, pathImg, key, file, modCnf.imagesSizes, cb);
          },
          save: ['convert', (results, cb) => {
            const files = [];
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
              files.push('jpg');
              files.push('webp');
            } else {
              files.push(originalExt);
            }
            let sizes = [];
            if (['image/png', 'image/jpeg', 'image/webp'].indexOf(file.mimetype) >= 0) {
              sizes = _.map(modCnf.imagesSizes, 'x');
            }
            const multimedia = new models.Multimedia({
              tenancy: req.tenancy,
              key,
              files,
              sizes,
            });
            multimedia.save(cb);
          }],

        }, cb);
      }, cb);
    }],
    imagenUrl: ['uploadFile', (results, cb) => {
      imagenUrl(req, _.map(results.uploadFile, (f) => f.save.toObject()), cb);
    }],
    urls: ['imagenUrl', (results, cb) => {
      if (!req.files || !req.files.images) {
        return cb();
      }
      const first = _.first(results.imagenUrl);
      if (first.sizes.length) {
        return cb(null,
          {
            urls: first.urlSize[first.files[0]],
          });
      }
      cb(null, {
        url: first.url[first.files[0]],
      });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.urls);
  });
};
