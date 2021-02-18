const { imageToS3 } = require('../../../../libs/image.lib');
const { checkStore } = require('../../../../modules/site/libs/check-store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'name',
    'slug',
    'slogan',
    'seo',
    'inventory',
    'featuredCategories',
    'vision',
    'descriptionLong',
    'contacts',
    'address',
    'publish',
    'deliveries',
    'payments',
    'department',
    'town',
    'primaryActivity',
    'showcase',
    'mode',
  ]);
  if (req.body.lat && req.body.lng) {
    body['location.type'] = 'Point';
    body['location.coordinates'] = [req.body.lng, req.body.lat];
  }
  if (body.deliveries) {
    body.deliveries = _.map(global.deliveries, (delivery) => {
      const d = _.find(body.deliveries, { slug: delivery.slug });
      const val = _.get(d, 'value') || 0;
      return {
        slug: delivery.slug,
        active: _.get(d, 'active') || false,
        value: delivery.virtualDelivery || delivery.personalDelivery ? 0 : val,
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
      if (contact[3].cellphone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

        if (d.value && !re.test(d.value)) {
          errors.push({ field: 'cellphone', msg: __('Debe escribir un número de célular válido') });
        }
        if (d.value.length === 10) {
          d.value = `+57${d.value}`;
        }
        if (d.value.length === 12) {
          d.value = `+${d.value}`;
        }
      }
      return {
        slug: contact[0],
        value: _.get(d, 'value') || '',
      };
    });
  }
  const adminQuery = {
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      if (req.user.admin) {
        delete adminQuery.userID;
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Store
        .findOne(adminQuery)
        .exec(cb);
    }],
    uploadFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'No existe la tienda.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.files) {
        return cb();
      }
      async.eachOfLimit(req.files, 5, (file, key, cb) => {
        if (['image/jpeg', 'image/png'].indexOf(file.mimetype) === -1) {
          return cb();
        }
        if (!_.get(global, `storeImageSizes.${key}`)) {
          return cb();
        }

        const cimg = _.random(10000, 99999);
        results.query.images[key] = cimg;
        const pathImg = `${req.params.storeID}/images/${key}`;
        imageToS3(pathImg, null, file, global.storeImageSizes[key], true, global.storeImageFit[key], cb);
      }, cb);
    }],
    save: ['uploadFile', (results, cb) => {
      results.query.set(body);
      if (results.query.publish) {
        checkStore(results.query, cb);
      } else {
        results.query.save(cb);
      }
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
