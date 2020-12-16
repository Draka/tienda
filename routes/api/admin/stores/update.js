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
    'description',
    'inventory',
    'featuredCategories',
    'vision',
    'descriptionLong',
    'contacts',
    'address',
    'publish',
    'deliveries',
    'payments',
  ]);
  if (req.body.lat && req.body.lng) {
    body['location.type'] = 'Point';
    body['location.coordinates'] = [req.body.lng, req.body.lat];
  }
  if (body.deliveries) {
    body.deliveries = _.map(global.deliveries, (delivery) => {
      const d = _.find(body.deliveries, { slug: delivery.slug });
      return {
        slug: delivery.slug,
        active: _.get(d, 'active') || false,
        value: _.get(d, 'value') || 0,
      };
    });
  }
  if (body.payments) {
    body.payments = _.map(global.payments, (payment) => {
      const d = _.find(body.payments, { slug: payment.slug });
      return {
        slug: payment.slug,
        active: _.get(d, 'active') || false,
      };
    });
  }
  if (body.contacts) {
    body.contacts = _.map(global.socialMedia, (contact) => {
      const d = _.find(body.contacts, { slug: contact[0] });
      return {
        slug: contact[0],
        value: _.get(d, 'value') || '',
      };
    });
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
      const pathImg = `${req.params.storeID}/logo`;
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
