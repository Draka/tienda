const { imageToS3 } = require('../../../../libs/image.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'name',
    'slogan',
    'separator',
    'description',
    'multiStore',
    'defaultPlace',
    'inventory',
    'slots',
    'userID',
    'featuredCategories',
    'deliveriesCompaniesIDs',
    'paymentsMethodsIDs',
    'vision',
    'descriptionLong',
    'contacts',
    'address',
    'publish',
  ]);
  if (req.body.lat && req.body.lng) {
    body['location.type'] = 'Point';
    body['location.coordinates'] = [req.body.lng, req.body.lat];
  }
  async.auto({
    validate: (cb) => {
      if (body.deliveriesCompaniesIDs) {
        if (body.deliveriesCompaniesIDs[0]._id) {
          body.deliveriesCompaniesIDs = _.uniqBy(body.deliveriesCompaniesIDs, '_id');
        } else {
          body.deliveriesCompaniesIDs = _.uniq(body.deliveriesCompaniesIDs);
        }
      }
      if (body.paymentsMethodsIDs) {
        if (body.paymentsMethodsIDs[0]._id) {
          body.paymentsMethodsIDs = _.uniqBy(body.paymentsMethodsIDs, '_id');
        } else {
          body.paymentsMethodsIDs = _.uniq(body.paymentsMethodsIDs);
        }
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Store
        .findById(req.params.storeID)
        .exec(cb);
    }],
    uploadFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'No existe el producto.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.files) {
        return cb();
      }
      const mimetype = _.get(req, 'files.image.mimetype');
      if (['image/jpeg', 'image/png'].indexOf(mimetype) === -1) {
        return cb();
      }

      const cimg = _.random(10000, 99999);
      results.query.image = cimg;
      const pathImg = `ecommerce/${req.params.storeID}/logo`;
      imageToS3(pathImg, null, req.files.image, global.imagesSizes, true, cb);
    }],
    save: ['uploadFile', (results, cb) => {
      results.query.set(body).save(cb);
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
