const query = require('../../../../libs/query.lib');
const { checkProduct } = require('../../../../modules/site/libs/check-store.lib');
const { imageToS3 } = require('../../../../libs/image.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'publish',
    'name',
    'inventory',
    'stock',
    'price',
    'sku',
    'upc',
    'brandText',
    'shortDescription',
    'longDescription',
    'featured',
    'features',
    'digital',
    'available',
    'groups',
    'weight',
    'length',
    'height',
    'width',
    'amz',
    'offer',
  ]);
  body.tenancy = req.tenancy;

  const adminQuery = {
    tenancy: req.tenancy,
    _id: req.params.storeID,
    userID: req.user._id,
  };
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  if (body.digital && typeof body.digital.is !== 'undefined' && !body.digital.is) {
    _.set(body, 'digital.is', false);
  }

  if (_.get(body, 'available.start')) {
    body.available.start = moment.tz(body.available.start, global.tz);
  }
  if (_.get(body, 'available.end')) {
    body.available.end = moment.tz(body.available.end, global.tz);
  }
  if (_.get(body, 'offer.available.start')) {
    body.offer.available.start = moment.tz(body.offer.available.start, global.tz);
  }
  if (_.get(body, 'offer.available.end')) {
    body.offer.available.end = moment.tz(body.offer.available.end, global.tz);
  }

  async.auto({
    validate: (cb) => {
      if (!_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Producto válido.' });
      }
      if (!_.trim(body.sku)) {
        body.sku = Math.random().toString(36).substring(6);
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (req.user.admin) {
        delete adminQuery.userID;
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne(adminQuery)
        .exec(cb);
    }],
    query: ['validate', (_results, cb) => {
      models.Product
        .findOne({ tenancy: req.tenancy, sku: _.kebabCase(_.deburr(body.sku)), storeID: req.params.storeID })
        .exec(cb);
    }],
    check: ['store', 'query', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      if (results.query) {
        errors.push({ field: 'sku', msg: 'Ya existe un producto con ese sku.' });
        return cb(listErrors(409, null, errors));
      }
      cb();
    }],
    category: ['check', (_results, cb) => {
      if (!req.body.categoryID) {
        return cb();
      }
      query.up(req, [], req.body.categoryID._id || req.body.categoryID, cb);
    }],
    create: ['category', (results, cb) => {
      if (results.category) {
        body.categoryIDs = _.map(results.category, (o) => o._id);
        body.categoryText = _.map(results.category, (o) => o.name);
      }
      body.storeID = req.params.storeID;
      body.storeText = results.store.name;
      const product = new models.Product(body);
      if (product.publish) {
        checkProduct(results.store, product, cb);
      } else {
        product.save(cb);
      }
    }],
    uploadFile: ['create', (results, cb) => {
      if (!req.files) {
        return cb();
      }
      if (!_.isArray(req.files.images)) {
        req.files.images = [req.files.images];
      }

      async.eachLimit(req.files.images, 10, (image, cb) => {
        let cimg;
        do {
          cimg = _.random(10000, 99999);
        } while (results.create.images.indexOf(cimg) !== -1);
        results.create.images.push(cimg);
        const pathImg = `${req.params.storeID}/products/${results.create._id}/${cimg}`;
        imageToS3(req, pathImg, null, image, global.imagesSizes, true, 'contain', cb);
      }, (err) => {
        if (err) return cb(err);
        results.create.save(cb);
      });
    }],
    urlFile: ['create', (results, cb) => {
      if (!req.body.urlFiles) {
        return cb();
      }
      req.body.urlFiles = req.body.urlFiles.split('\n');

      async.eachLimit(req.body.urlFiles, 10, (urlImg, cb) => {
        urlImg = _.trim(urlImg);
        if (!urlImg) {
          return cb();
        }
        let cimg;
        do {
          cimg = _.random(10000, 99999);
        } while (results.create.images.indexOf(cimg) !== -1);
        results.create.images.push(cimg);
        const pathImg = `${req.params.storeID}/products/${results.create._id}/${cimg}`;
        imageToS3(req, pathImg, urlImg, null, global.imagesSizes, true, 'contain', cb);
      }, (err) => {
        if (err) return cb(err);
        results.create.save(cb);
      });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.create);
  });
};
